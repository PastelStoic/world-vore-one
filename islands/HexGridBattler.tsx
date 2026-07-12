import { useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { SessionUser } from "@/lib/session_types.ts";
import {
  type BattlerState,
  type Combatant,
  COVER_LABELS,
  type CoverType,
  createEmptyBattlerState,
  type ImportableCharacter,
  TEAM_COLORS,
  type ToolMode,
} from "@/lib/battler_types.ts";
import {
  type AxialCoord,
  coordKey,
  generateRectangularGrid,
  HEX_SIZE,
  hexCorners,
  hexToPixel,
  parseCoordKey,
  pixelToHex,
  type Point,
} from "@/lib/hex-grid.ts";

// --- View / interaction constants ---
const MIN_SCALE = 0.35;
const MAX_SCALE = 4.0;
const ZOOM_FACTOR = 1.15;
const INITIAL_GRID = generateRectangularGrid(-7, 7, -6, 6); // nice starting map

// Local persistence (full battle state survives refresh)
const STORAGE_KEY = "wvo-hex-battler-v1";
const AUTOSAVE_DEBOUNCE_MS = 350;

interface HexGridBattlerProps {
  user: SessionUser | null;
}

export default function HexGridBattler({ user }: HexGridBattlerProps) {
  // Core battle state with localStorage load on first mount
  const [state, setState] = useState<BattlerState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BattlerState;
        if (parsed && parsed.version === 1) {
          return parsed;
        }
      }
    } catch {
      // ignore corrupted storage
    }
    return createEmptyBattlerState();
  });

  // View transform (fine-grained reactivity)
  const view = useSignal({ scale: 1.0, tx: 0, ty: 0 });

  // Tool state
  const [mode, setMode] = useState<ToolMode>("select");
  const [showCoords, setShowCoords] = useState(true);

  // For "click to place this combatant" flow (satisfies requirement 1 beautifully)
  const [placingCombatantId, setPlacingCombatantId] = useState<string | null>(
    null,
  );

  // Cover placement state (for requirement 2)
  const [placingCoverType, setPlacingCoverType] = useState<CoverType | null>(
    null,
  );

  // Selection for roster <-> grid sync + drag to move
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Live drag preview position (world space) when moving a token
  const dragState = useSignal<
    {
      combatantId: string;
      worldX: number;
      worldY: number;
    } | null
  >(null);

  // Import from sheets modal state (requirement 3)
  const [showImportModal, setShowImportModal] = useState(false);
  const [importQuery, setImportQuery] = useState("");
  const [importResults, setImportResults] = useState<
    {
      mine: ImportableCharacter[];
      public: ImportableCharacter[];
    } | null
  >(null);
  const [importLoading, setImportLoading] = useState(false);

  // Drag / pointer state (for pan + future token drag)
  const isPanning = useRef(false);
  const lastPointer = useRef<Point>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Token drag tracking (separate from panning)
  const draggingTokenRef = useRef<
    {
      id: string;
      offsetX: number; // world space: pointer world pos - token center
      offsetY: number;
    } | null
  >(null);

  // --- Coordinate conversion helpers (world pixels <-> screen) ---
  // unused but possibly helpful, remove underscore when using
  const _worldToScreen = useCallback((p: Point): Point => {
    const v = view.value;
    return {
      x: p.x * v.scale + v.tx,
      y: p.y * v.scale + v.ty,
    };
  }, []);

  const screenToWorld = useCallback((p: Point): Point => {
    const v = view.value;
    return {
      x: (p.x - v.tx) / v.scale,
      y: (p.y - v.ty) / v.scale,
    };
  }, []);

  // --- Zoom & Pan ---
  const zoomBy = useCallback((factor: number, center?: Point) => {
    const v = view.value;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, v.scale * factor));

    if (!center || !svgRef.current) {
      // Zoom toward current center
      view.value = { ...v, scale: newScale };
      return;
    }

    // Zoom toward a specific screen point (mouse)
    const worldBefore = screenToWorld(center);
    const newTx = center.x - worldBefore.x * newScale;
    const newTy = center.y - worldBefore.y * newScale;

    view.value = { scale: newScale, tx: newTx, ty: newTy };
  }, [screenToWorld]);

  const resetView = useCallback(() => {
    // Center the initial grid roughly
    const approxCenterWorld = { x: 0, y: 20 };
    const svg = svgRef.current;
    if (!svg) {
      view.value = { scale: 1, tx: -80, ty: -60 };
      return;
    }
    const rect = svg.getBoundingClientRect();
    const targetScale = 0.95;
    view.value = {
      scale: targetScale,
      tx: rect.width / 2 - approxCenterWorld.x * targetScale,
      ty: rect.height / 2 - approxCenterWorld.y * targetScale,
    };
  }, []);

  // Wheel zoom (centered on mouse)
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const factor = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    zoomBy(factor, mouse);
  }, [zoomBy]);

  // Pointer pan (background)
  const onPointerDown = useCallback((e: PointerEvent) => {
    if (mode !== "select") return;
    if (placingCombatantId) return;
    if (draggingTokenRef.current) return; // already dragging a token

    const svg = svgRef.current;
    if (!svg) return;
    svg.setPointerCapture(e.pointerId);
    isPanning.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  }, [mode, placingCombatantId]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld({ x: screenX, y: screenY });

    // Token dragging takes priority
    if (draggingTokenRef.current) {
      const drag = draggingTokenRef.current;
      dragState.value = {
        combatantId: drag.id,
        worldX: worldPos.x - drag.offsetX,
        worldY: worldPos.y - drag.offsetY,
      };
      lastPointer.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!isPanning.current) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    const v = view.value;
    view.value = { ...v, tx: v.tx + dx, ty: v.ty + dy };
  }, [screenToWorld]);

  const onPointerUp = useCallback((e: PointerEvent) => {
    const svg = svgRef.current;
    if (svg) svg.releasePointerCapture(e.pointerId);

    const wasDraggingToken = !!draggingTokenRef.current;

    // Finish token drag
    if (draggingTokenRef.current && dragState.value) {
      const { id: combatantId } = draggingTokenRef.current;
      const finalWorld = {
        x: dragState.value.worldX,
        y: dragState.value.worldY,
      };

      const targetHex = pixelToHex(finalWorld.x, finalWorld.y);
      const key = coordKey(targetHex);

      setState((s) => {
        const currentOccupant = s.placedCharacters[key];
        const isOccupiedByOther = currentOccupant &&
          currentOccupant !== combatantId;

        // Always allow characters onto cover hexes.
        // Whether it's realistic depends on the specific cover (rubble, car, etc.)
        // and the group can self-regulate.
        if (isOccupiedByOther) {
          return s; // can't stack on another character
        }

        const newPlaced: Record<string, string> = {};
        for (const [k, v] of Object.entries(s.placedCharacters)) {
          if (v !== combatantId) newPlaced[k] = v;
        }
        newPlaced[key] = combatantId;

        return { ...s, placedCharacters: newPlaced };
      });

      // Clear drag state
      draggingTokenRef.current = null;
      dragState.value = null;
    }

    isPanning.current = false;

    // If we weren't dragging a token, and we clicked background, clear selection
    if (!wasDraggingToken && !draggingTokenRef.current) {
      // Let the onBackgroundClick handle deselection if needed
    }
  }, []);

  // Click on background
  const onBackgroundClick = useCallback(() => {
    if (placingCombatantId) {
      cancelPlacing();
    } else if (mode === "place-cover") {
      setMode("select");
      setPlacingCoverType(null);
    } else if (mode === "select") {
      setSelectedId(null); // deselect when clicking empty space
    }
  }, [placingCombatantId, mode]);

  // --- Hex polygon rendering ---
  const hexElements = INITIAL_GRID.map((hex) => {
    const center = hexToPixel(hex);
    const corners = hexCorners(center);
    const points = corners.map((p) => `${p.x},${p.y}`).join(" ");
    const key = coordKey(hex);

    return (
      <g key={key}>
        <polygon
          points={points}
          fill="currentColor"
          fill-opacity="0.035"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-opacity="0.35"
          class="pointer-events-auto"
          pointer-events="all"
          onClick={(e) => {
            e.stopPropagation();

            if (placingCombatantId) {
              placeCombatantOnHex(placingCombatantId, hex);
            } else if (mode === "place-cover" && placingCoverType) {
              placeCoverOnHex(placingCoverType, hex);
            } else {
              console.log("hex clicked", hex);
            }
          }}
        />
        {showCoords && (
          <text
            x={center.x}
            y={center.y + 4}
            font-size="9"
            font-weight="600"
            text-anchor="middle"
            fill="#0f172a"
            stroke="#f8fafc"
            stroke-width="2"
            paint-order="stroke"
            class="select-none pointer-events-none"
          >
            {hex.q},{hex.r}
          </text>
        )}
      </g>
    );
  });

  // Cover shading fills — each hex gets the full pattern (tint + distinctive marks inside the pattern).
  const coverFillElements = Object.entries(state.covers).map(([key, cover]) => {
    const hex = parseCoordKey(key);
    const center = hexToPixel(hex);
    const corners = hexCorners(center);
    const points = corners.map((p) => `${p.x},${p.y}`).join(" ");

    const patternId = `cover-${cover.type}`;

    return (
      <polygon
        key={`coverfill-${key}`}
        points={points}
        fill={`url(#${patternId})`}
        stroke="none"
        pointer-events="none"
      />
    );
  });

  // --- Initial view centering (once on mount) ---
  useEffect(() => {
    // Small delay so the SVG has a real size
    const t = setTimeout(() => resetView(), 60);
    return () => clearTimeout(t);
  }, [resetView]);

  // Debounced autosave to localStorage whenever state changes
  useEffect(() => {
    const handle = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // quota or private mode — ignore
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [state]);

  // ESC cancels placement modes + closes import modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (placingCombatantId) {
          e.preventDefault();
          cancelPlacing();
        } else if (mode === "place-cover") {
          e.preventDefault();
          setMode("select");
          setPlacingCoverType(null);
        } else if (showImportModal) {
          e.preventDefault();
          closeImportModal();
        }
      }
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [placingCombatantId, mode, showImportModal]);

  // Attach wheel listener (passive: false so we can preventDefault)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => onWheel(e);
    svg.addEventListener("wheel", handler, { passive: false });
    return () => svg.removeEventListener("wheel", handler);
  }, [onWheel]);

  // --- Minimal roster UI (foundation only — fully wired in slice 03) ---
  const addDummy = () => {
    // Compute the letter first so we can attach it for disambiguation,
    // but do *not* include it in the suggested name (user preference).
    const nextLabel = getNextAvailableLabel(state.combatants);

    const name = prompt("Dummy name?", "Rifleman")?.trim();
    if (!name) return;
    const maxHp = Number(prompt("Max HP?", "12")) || 12;

    const dummy: Combatant = {
      id: crypto.randomUUID(),
      name,
      currentHealth: maxHp,
      maxHealth: maxHp,
      team: "neutral",
      label: nextLabel,
    };
    setState((s) => ({
      ...s,
      combatants: [...s.combatants, dummy],
    }));
  };

  // --- Roster mutators (used by the interactive list) ---
  const TEAM_ORDER: Combatant["team"][] = ["allies", "enemies", "neutral"];

  function cycleTeam(id: string) {
    setState((s) => ({
      ...s,
      combatants: s.combatants.map((c) =>
        c.id === id
          ? { ...c, team: TEAM_ORDER[(TEAM_ORDER.indexOf(c.team) + 1) % 3] }
          : c
      ),
    }));
  }

  function adjustHealth(id: string, delta: number) {
    setState((s) => ({
      ...s,
      combatants: s.combatants.map((c) => {
        if (c.id !== id) return c;
        const next = Math.max(
          0,
          Math.min(c.maxHealth, c.currentHealth + delta),
        );
        return { ...c, currentHealth: next };
      }),
    }));
  }

  function renameCombatant(id: string) {
    const c = state.combatants.find((x) => x.id === id);
    if (!c) return;
    const newName = prompt("Rename combatant", c.name)?.trim();
    if (!newName || newName === c.name) return;
    setState((s) => ({
      ...s,
      combatants: s.combatants.map((
        x,
      ) => (x.id === id ? { ...x, name: newName } : x)),
    }));
  }

  function removeCombatant(id: string) {
    if (
      !confirm(
        `Remove "${
          state.combatants.find((c) => c.id === id)?.name
        }" from the battle?`,
      )
    ) return;
    setState((s) => {
      // Remove the character from the placed map (if present)
      const newPlaced: Record<string, string> = {};
      for (const [k, v] of Object.entries(s.placedCharacters)) {
        if (v !== id) newPlaced[k] = v;
      }
      return {
        ...s,
        combatants: s.combatants.filter((c) => c.id !== id),
        placedCharacters: newPlaced,
      };
    });
  }

  const resetBattle = () => {
    if (
      !confirm(
        "Start a completely new battle? This clears the roster and grid (local copy is autosaved).",
      )
    ) return;
    const fresh = createEmptyBattlerState();
    setState(fresh);
    setPlacingCombatantId(null);
    // Also recenter view for a clean feel
    resetView();
  };

  // --- Core grid placement logic (requirement #1) ---
  function placeCombatantOnHex(combatantId: string, hex: AxialCoord) {
    const key = coordKey(hex);
    setState((s) => {
      // If something else is already here, swap it off (simple rule for v1)
      const newPlaced = { ...s.placedCharacters };
      const occupant = newPlaced[key];
      if (occupant && occupant !== combatantId) {
        // occupant is bumped off-grid (position just overwritten)
      }
      newPlaced[key] = combatantId;
      return { ...s, placedCharacters: newPlaced };
    });
    setPlacingCombatantId(null);
  }

  function removeFromGrid(combatantId: string) {
    setState((s) => {
      const newPlaced: Record<string, string> = {};
      for (const [k, v] of Object.entries(s.placedCharacters)) {
        if (v !== combatantId) newPlaced[k] = v;
      }
      return { ...s, placedCharacters: newPlaced };
    });
  }

  // Called from roster row
  function startPlacing(combatantId: string) {
    setPlacingCombatantId(combatantId);
    setMode("select");
    setPlacingCoverType(null);
    setSelectedId(null);
  }

  function cancelPlacing() {
    setPlacingCombatantId(null);
  }

  // --- Cover placement (requirement #2) ---
  function placeCoverOnHex(type: CoverType, hex: AxialCoord) {
    const key = coordKey(hex);
    const defaultPassable = type === "weak" || type === "middling"
      ? true
      : false;

    setState((s) => ({
      ...s,
      covers: {
        ...s.covers,
        [key]: {
          id: crypto.randomUUID(),
          type,
          passable: defaultPassable,
        },
      },
    }));

    // Stay in cover mode so user can quickly place multiple
  }

  // --- Token drag + selection helpers ---
  function handleTokenPointerDown(
    e: PointerEvent,
    combatantId: string,
    currentCenter: Point,
  ) {
    if (mode !== "select") return;
    e.stopPropagation();

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld({ x: screenX, y: screenY });

    draggingTokenRef.current = {
      id: combatantId,
      offsetX: worldPos.x - currentCenter.x,
      offsetY: worldPos.y - currentCenter.y,
    };

    setSelectedId(combatantId);

    // Start live drag preview
    dragState.value = {
      combatantId,
      worldX: currentCenter.x,
      worldY: currentCenter.y,
    };

    svg.setPointerCapture(e.pointerId);
    lastPointer.current = { x: e.clientX, y: e.clientY };
  }

  /** Returns the next unused single letter (A-Z) for dummy labeling. */
  function getNextAvailableLabel(combatants: Combatant[]): string {
    const used = new Set(
      combatants
        .map((c) => c.label)
        .filter((l): l is string => Boolean(l)),
    );

    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i); // 'A' = 65
      if (!used.has(letter)) {
        return letter;
      }
    }
    // Fallback if somehow all 26 letters are used (very unlikely in a skirmish)
    return "Z";
  }

  // --- Import from existing sheets (requirement 3) ---
  async function loadImportResults(q: string = "") {
    if (!user) return;
    setImportLoading(true);
    try {
      const res = await fetch(
        `/api/battler/available-characters${
          q ? `?q=${encodeURIComponent(q)}` : ""
        }`,
      );
      if (res.ok) {
        const data: {
          mine: ImportableCharacter[];
          public: ImportableCharacter[];
        } = await res.json();
        setImportResults(data);
      } else {
        setImportResults({ mine: [], public: [] });
      }
    } catch {
      setImportResults({ mine: [], public: [] });
    } finally {
      setImportLoading(false);
    }
  }

  function openImportModal() {
    setShowImportModal(true);
    setImportQuery("");
    loadImportResults("");
  }

  function closeImportModal() {
    setShowImportModal(false);
    setImportResults(null);
    setImportQuery("");
  }

  function importCharacter(char: ImportableCharacter) {
    // Add as a real imported combatant (no auto letter label)
    const newCombatant: Combatant = {
      id: crypto.randomUUID(),
      name: char.name,
      currentHealth: char.maxHealth,
      maxHealth: char.maxHealth,
      team: "neutral",
      characterId: char.id,
      // No label for imported characters - they have real identities
    };

    setState((s) => ({
      ...s,
      combatants: [...s.combatants, newCombatant],
    }));

    // Keep modal open so user can import several at once
  }

  const v = view.value;

  return (
    <>
      <div class="flex flex-1 overflow-hidden">
        {/* Left: Roster (stub) */}
        <aside class="w-72 min-w-64 max-w-80 border-r border-base-300 bg-base-100 flex flex-col overflow-hidden">
          <div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-200/60">
            <div>
              <div class="font-semibold">Roster</div>
              <div class="text-xs text-base-content/60">
                {state.combatants.length} combatants
              </div>
            </div>
            <div class="flex gap-1">
              <button
                type="button"
                onClick={addDummy}
                class="px-2.5 py-1 text-xs border rounded bg-base-100 hover:bg-base-200 active:bg-base-300"
              >
                + Dummy
              </button>
              {user && (
                <button
                  type="button"
                  onClick={openImportModal}
                  class="px-2.5 py-1 text-xs border rounded bg-base-100 hover:bg-base-200 active:bg-base-300"
                  title="Import characters from existing sheets"
                >
                  Import
                </button>
              )}
            </div>
          </div>

          <div class="flex-1 overflow-auto p-2 space-y-1 text-sm">
            {state.combatants.length === 0 && (
              <div class="px-2 py-6 text-center text-base-content/60 text-xs">
                No characters yet.<br />
                Add dummies or import real sheets.
              </div>
            )}
            {state.combatants.map((c) => {
              const onGrid = Object.values(state.placedCharacters).includes(
                c.id,
              );
              const isSelected = selectedId === c.id;

              return (
                <div
                  key={c.id}
                  class={`border rounded px-2 py-1.5 bg-base-100 flex items-center gap-2 group cursor-pointer transition-colors ${
                    isSelected
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-base-200"
                  }`}
                  onClick={() => setSelectedId(c.id)}
                >
                  {/* Team color — click to cycle */}
                  <button
                    type="button"
                    onClick={() => cycleTeam(c.id)}
                    class="w-3 h-3 rounded-full shrink-0 border border-base-300"
                    style={{ backgroundColor: TEAM_COLORS[c.team] }}
                    title="Cycle team (allies / enemies / neutral)"
                  />

                  <div class="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => renameCombatant(c.id)}
                      class="font-medium truncate hover:underline text-left w-full flex items-center gap-1.5"
                      title="Click to rename"
                    >
                      {c.name}
                      {c.label && (
                        <span
                          class="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded bg-base-300 text-base-content/80 shrink-0"
                          title={`Label ${c.label}`}
                        >
                          {c.label}
                        </span>
                      )}
                    </button>
                    {/* Health controls */}
                    <div class="flex items-center gap-1 text-[10px] tabular-nums text-base-content/80 mt-0.5">
                      <button
                        type="button"
                        onClick={() => adjustHealth(c.id, -5)}
                        class="px-1 rounded hover:bg-base-200 active:bg-base-300"
                      >
                        −5
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustHealth(c.id, -1)}
                        class="px-1 rounded hover:bg-base-200 active:bg-base-300"
                      >
                        −1
                      </button>
                      <span class="font-medium px-0.5">
                        {c.currentHealth} / {c.maxHealth}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjustHealth(c.id, 1)}
                        class="px-1 rounded hover:bg-base-200 active:bg-base-300"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustHealth(c.id, 5)}
                        class="px-1 rounded hover:bg-base-200 active:bg-base-300"
                      >
                        +5
                      </button>
                    </div>
                  </div>

                  <div class="flex flex-col items-end gap-0.5 text-[10px]">
                    <span
                      class={`px-1 rounded ${
                        onGrid
                          ? "bg-success/20 text-success"
                          : "text-base-content/50"
                      }`}
                    >
                      {onGrid ? "on grid" : "off grid"}
                    </span>

                    {onGrid
                      ? (
                        <button
                          type="button"
                          onClick={() => removeFromGrid(c.id)}
                          class="text-primary hover:underline"
                        >
                          Remove from grid
                        </button>
                      )
                      : (
                        <button
                          type="button"
                          onClick={() => startPlacing(c.id)}
                          class="text-primary hover:underline font-medium"
                        >
                          Deploy to grid
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={() => removeCombatant(c.id)}
                      class="text-error/70 hover:text-error opacity-70 group-hover:opacity-100"
                      title="Remove from battle entirely"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div class="p-2 text-[10px] text-base-content/50 border-t border-base-300 flex gap-2">
            <button
              type="button"
              onClick={resetBattle}
              class="text-error/80 hover:text-error underline"
            >
              New Battle
            </button>
            <span class="flex-1" />
            <span>HP editing live • autosaves</span>
          </div>
        </aside>

        {/* Center: The Grid */}
        <main class="flex-1 relative overflow-hidden bg-base-100 select-none">
          <svg
            ref={svgRef}
            class="absolute inset-0 w-full h-full touch-none"
            style={{
              cursor: isPanning.current
                ? "grabbing"
                : placingCombatantId || mode === "place-cover"
                ? "crosshair"
                : mode === "select"
                ? "grab"
                : "crosshair",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onClick={onBackgroundClick}
          >
            {
              /* SVG patterns for cover shading.
               Clear progression:
               - Weak:     Dots
               - Middling: Dashed lines (straight line with gaps)
               - Strong:   Solid lines
               - Fortified: Crossed lines (crosshatch)
               Works in both light and dark mode. */
            }
            <defs>
              {/* Weak: Dots (lowest tier) */}
              <pattern
                id="cover-weak"
                patternUnits="userSpaceOnUse"
                width="9"
                height="9"
              >
                <rect width="9" height="9" fill="#c9b896" fill-opacity="0.22" />
                <circle
                  cx="2.2"
                  cy="2.2"
                  r="1.05"
                  fill="#64748b"
                  fill-opacity="0.6"
                />
                <circle
                  cx="6.8"
                  cy="6.8"
                  r="1.05"
                  fill="#64748b"
                  fill-opacity="0.6"
                />
              </pattern>

              {/* Middling: Dashed lines (straight line with clear gaps) */}
              <pattern
                id="cover-middling"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
                patternTransform="rotate(45)"
              >
                <circle cx="0" cy="12" r="1.2" fill="currentColor" />
                <circle cx="6" cy="6" r="1.2" fill="currentColor" />
                <circle cx="12" cy="0" r="1.2" fill="currentColor" />
              </pattern>

              {/* Strong: Solid lines (thicker, clear continuous line) */}
              <pattern
                id="cover-strong"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
                patternTransform="rotate(45)"
              >
                <path
                  d="M-2 10 L10 -2 M0 12 L12 0"
                  stroke="currentColor"
                  stroke-width="0.5"
                />
              </pattern>

              {/* Fortified: Crossed lines (dense crosshatch) */}
              <pattern
                id="cover-fortified"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
                patternTransform="rotate(45)"
              >
                <path
                  d="M-2 10 L10 -2 M0 12 L12 0"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </pattern>
            </defs>

            {/* World group with pan/zoom transform */}
            <g transform={`translate(${v.tx} ${v.ty}) scale(${v.scale})`}>
              {/* Subtle ground fill for the whole map area — must not steal clicks from hexes */}
              <rect
                x={-HEX_SIZE * 10}
                y={-HEX_SIZE * 9}
                width={HEX_SIZE * 22}
                height={HEX_SIZE * 19}
                fill="currentColor"
                fill-opacity="0.015"
                stroke="none"
                pointer-events="none"
              />

              {/* All hexes */}
              {hexElements}

              {/* Cover shading fills — patterns on the hex itself for connected look */}
              {coverFillElements}

              {/* Character tokens (drawn on top) — requirement #1 */}
              {Object.entries(state.placedCharacters).map(
                ([key, combatantId]) => {
                  // Don't render the normal token if we're currently dragging it
                  if (dragState.value?.combatantId === combatantId) return null;

                  const c = state.combatants.find((x) => x.id === combatantId);
                  if (!c) return null;
                  const coord = parseCoordKey(key);
                  const center = hexToPixel(coord);
                  const color = TEAM_COLORS[c.team];
                  const isSelected = selectedId === combatantId;

                  // Prefer explicit label (A, B, C...) for dummies
                  const displayLabel = c.label ??
                    c.name.slice(0, 2).toUpperCase();
                  const isSingleLetterLabel = Boolean(c.label);

                  return (
                    <g
                      key={`token-${combatantId}`}
                      class="cursor-move"
                      onPointerDown={(e) =>
                        handleTokenPointerDown(e, combatantId, center)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(combatantId);
                      }}
                    >
                      {/* Token circle - thicker + brighter stroke when selected */}
                      <circle
                        cx={center.x}
                        cy={center.y}
                        r={HEX_SIZE * 0.42}
                        fill={color}
                        fill-opacity="0.92"
                        stroke={isSelected ? "#fde047" : "#111827"}
                        stroke-width={isSelected ? 4 : 2.5}
                      />
                      {
                        /* Label or initials on token.
                      Single-letter labels (for dummies) are larger and more prominent. */
                      }
                      <text
                        x={center.x}
                        y={center.y + (isSingleLetterLabel ? 4 : 3)}
                        font-size={isSingleLetterLabel ? "17" : "13"}
                        font-weight="700"
                        text-anchor="middle"
                        fill="white"
                        stroke="#111827"
                        stroke-width="0.6"
                        paint-order="stroke"
                        class="select-none pointer-events-none"
                      >
                        {displayLabel}
                      </text>
                      {/* Tiny HP badge */}
                      <text
                        x={center.x}
                        y={center.y + HEX_SIZE * 0.58}
                        font-size="8.5"
                        text-anchor="middle"
                        fill="#111827"
                        fill-opacity="0.85"
                        class="select-none pointer-events-none font-medium"
                      >
                        {c.currentHealth}
                      </text>
                    </g>
                  );
                },
              )}

              {/* Live dragged token (rendered on top during drag) */}
              {dragState.value && (() => {
                const c = state.combatants.find(
                  (x) => x.id === dragState.value!.combatantId,
                );
                if (!c) return null;

                const { worldX, worldY } = dragState.value;
                const color = TEAM_COLORS[c.team];
                const displayLabel = c.label ??
                  c.name.slice(0, 2).toUpperCase();
                const isSingleLetterLabel = Boolean(c.label);

                return (
                  <g class="cursor-move pointer-events-none">
                    <circle
                      cx={worldX}
                      cy={worldY}
                      r={HEX_SIZE * 0.42}
                      fill={color}
                      fill-opacity="0.95"
                      stroke="#fde047"
                      stroke-width="4"
                    />
                    <text
                      x={worldX}
                      y={worldY + (isSingleLetterLabel ? 4 : 3)}
                      font-size={isSingleLetterLabel ? "17" : "13"}
                      font-weight="700"
                      text-anchor="middle"
                      fill="white"
                      stroke="#111827"
                      stroke-width="0.6"
                      paint-order="stroke"
                      class="select-none"
                    >
                      {displayLabel}
                    </text>
                  </g>
                );
              })()}
            </g>
          </svg>

          {/* Placing instruction banner (when active) */}
          {placingCombatantId && (
            <div class="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-content text-xs px-3 py-1 rounded-full shadow flex items-center gap-3">
              Click a hex to deploy •
              <button
                type="button"
                onClick={cancelPlacing}
                class="underline hover:no-underline font-medium"
              >
                Cancel (ESC)
              </button>
            </div>
          )}

          {/* Floating toolbar */}
          <div class="absolute top-3 left-3 bg-base-100/95 border border-base-300 rounded-lg shadow-sm px-2 py-1.5 flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => {
                setMode("select");
                setPlacingCoverType(null);
              }}
              class={`px-2 py-0.5 rounded ${
                mode === "select"
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200"
              }`}
            >
              Select / Pan
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("place-cover");
                setSelectedId(null);
                if (!placingCoverType) {
                  setPlacingCoverType("weak");
                }
              }}
              class={`px-2 py-0.5 rounded ${
                mode === "place-cover"
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200"
              }`}
            >
              Place Cover
            </button>

            <div class="w-px h-4 bg-base-300 mx-1" />

            {/* Mini cover type palette - only visible in cover mode */}
            {mode === "place-cover" && (
              <div class="flex items-center gap-1 pl-1 border-l border-base-300">
                {(["weak", "middling", "strong", "fortified"] as const).map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPlacingCoverType(t)}
                      class={`px-1.5 py-0.5 text-[10px] rounded border ${
                        placingCoverType === t
                          ? "bg-primary text-primary-content border-primary"
                          : "bg-base-100 hover:bg-base-200 border-base-300"
                      }`}
                      title={COVER_LABELS[t]}
                    >
                      {t[0].toUpperCase()}
                    </button>
                  ),
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => zoomBy(1 / ZOOM_FACTOR)}
              class="px-1.5 hover:bg-base-200 rounded"
              title="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => zoomBy(ZOOM_FACTOR)}
              class="px-1.5 hover:bg-base-200 rounded"
              title="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={resetView}
              class="px-2 text-xs hover:bg-base-200 rounded border border-base-300"
            >
              Fit
            </button>

            <div class="w-px h-4 bg-base-300 mx-1" />

            <label class="flex items-center gap-1 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showCoords}
                onChange={(e) =>
                  setShowCoords((e.target as HTMLInputElement).checked)}
              />
              Coords
            </label>
          </div>

          {/* Cover Legend - top right */}
          <div class="absolute top-3 right-3 bg-base-100/95 border border-base-300 rounded-lg shadow-sm px-3 py-1 text-[10px] flex items-center gap-2 z-10">
            <span class="font-semibold text-base-content/70 mr-1">Cover</span>
            {(["weak", "middling", "strong", "fortified"] as const).map((t) => (
              <div
                key={t}
                class="flex items-center gap-1"
                title={COVER_LABELS[t]}
              >
                <div
                  class="w-3 h-3 border border-base-300 shrink-0"
                  style={{
                    background: t === "weak"
                      ? "radial-gradient(circle, #64748b 0 25%, transparent 27%)"
                      : t === "middling"
                      ? "repeating-linear-gradient(45deg, #475569 0 1.8px, transparent 1.8px 5.5px)"
                      : t === "strong"
                      ? "repeating-linear-gradient(45deg, #334155 0 2px, transparent 2px 6px)"
                      : "repeating-linear-gradient(45deg, #1e2937 0 1.6px, transparent 1.6px 4.5px), repeating-linear-gradient(-45deg, #1e2937 0 1.6px, transparent 1.6px 4.5px)",
                  }}
                />
                <span class="text-base-content/80">{t[0].toUpperCase()}</span>
              </div>
            ))}
          </div>

          {/* Status line */}
          <div class="absolute bottom-2 right-3 text-[10px] px-2 py-0.5 bg-base-100/80 border border-base-300 rounded text-base-content/60 tabular-nums">
            {mode === "place-cover" && placingCoverType
              ? `Placing: ${
                COVER_LABELS[placingCoverType]
              } • Click hex to place • ESC to exit`
              : `Scale ${
                v.scale.toFixed(2)
              }× • ${INITIAL_GRID.length} hexes • Drag background to pan • Scroll to zoom`}
          </div>
        </main>

        {/* Right: Inspector stub */}
        <aside class="w-64 border-l border-base-300 bg-base-100 p-3 text-sm hidden xl:block overflow-auto">
          <div class="font-semibold mb-1">Inspector</div>
          <div class="text-xs text-base-content/60">
            Select a hex, token, or cover to see details (coming in slice 04+).
          </div>
          <div class="mt-4 text-[10px] text-base-content/50">
            Current mode: <span class="font-mono">{mode}</span>
          </div>
        </aside>
      </div>

      {/* Import Characters Modal */}
      {showImportModal && (
        <div
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closeImportModal}
        >
          <div
            class="bg-base-100 border border-base-300 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div class="flex items-center justify-between px-4 py-3 border-b border-base-300">
              <div>
                <div class="font-semibold">Import Characters from Sheets</div>
                <div class="text-xs text-base-content/60">
                  Your characters + approved public ones
                </div>
              </div>
              <button
                type="button"
                onClick={closeImportModal}
                class="text-xl leading-none px-2 text-base-content/60 hover:text-base-content"
              >
                ×
              </button>
            </div>

            {/* Search */}
            <div class="p-4 border-b border-base-300">
              <input
                type="text"
                value={importQuery}
                onInput={(e) => {
                  const val = (e.target as HTMLInputElement).value;
                  setImportQuery(val);
                  // Debounce lightly by just refetching on input
                  const _timer = setTimeout(() => loadImportResults(val), 250);
                  // Cleanup not critical for this simple case
                }}
                placeholder="Search by name or race..."
                class="w-full px-3 py-2 border border-base-300 rounded bg-base-100 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Results */}
            <div class="flex-1 overflow-auto p-4 space-y-6 text-sm">
              {importLoading && (
                <div class="text-center text-base-content/60 py-8">
                  Loading characters...
                </div>
              )}

              {!importLoading && importResults && (
                <>
                  {/* Your Characters */}
                  <div>
                    <div class="font-medium mb-2 text-base-content/80">
                      Your Characters ({importResults.mine.length})
                    </div>
                    {importResults.mine.length === 0 && (
                      <div class="text-xs text-base-content/50 pl-1">
                        No matches.
                      </div>
                    )}
                    <div class="space-y-1">
                      {importResults.mine.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => importCharacter(c)}
                          class="w-full text-left px-3 py-2 border border-base-300 rounded hover:bg-base-200 flex justify-between items-center"
                        >
                          <div>
                            <span class="font-medium">{c.name}</span>
                            <span class="text-xs text-base-content/60 ml-2">
                              {c.race}
                            </span>
                          </div>
                          <div class="text-xs tabular-nums text-base-content/70">
                            HP {c.maxHealth}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Public / Approved */}
                  <div>
                    <div class="font-medium mb-2 text-base-content/80">
                      Public / Approved ({importResults.public.length})
                    </div>
                    {importResults.public.length === 0 && (
                      <div class="text-xs text-base-content/50 pl-1">
                        No matches.
                      </div>
                    )}
                    <div class="space-y-1">
                      {importResults.public.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => importCharacter(c)}
                          class="w-full text-left px-3 py-2 border border-base-300 rounded hover:bg-base-200 flex justify-between items-center"
                        >
                          <div>
                            <span class="font-medium">{c.name}</span>
                            <span class="text-xs text-base-content/60 ml-2">
                              {c.race}
                            </span>
                          </div>
                          <div class="text-xs tabular-nums text-base-content/70">
                            HP {c.maxHealth}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!importLoading && !importResults && (
                <div class="text-center text-base-content/60 py-8">
                  Start typing to search characters.
                </div>
              )}
            </div>

            {/* Footer */}
            <div class="p-3 border-t border-base-300 text-[10px] text-base-content/50 flex justify-between">
              <div>
                Click a character to add it to the roster at full health.
              </div>
              <button
                type="button"
                onClick={closeImportModal}
                class="underline hover:no-underline"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
