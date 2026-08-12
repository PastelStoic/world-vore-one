import { useSignal } from "@preact/signals";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { SessionUser } from "@/lib/session_types.ts";
import {
  type BattleRoom,
  type BattlerState,
  type Combatant,
  COVER_LABELS,
  type CoverType,
  cloneBattlerState,
  coordKey,
  createEmptyBattlerState,
  type ImportableCharacter,
  parseBattlerState,
  parseCoordKey,
  TEAM_COLORS,
  type ToolMode,
} from "@/lib/battler_types.ts";
import {
  addCombatant,
  adjustHealth,
  cycleTeam,
  getNextAvailableLabel,
  placeCombatantOnHex,
  placeCoverOnHex,
  removeCombatant,
  removeCover,
  removeFromGrid,
  setCombatantMaxHealth,
  setCombatantName,
  setCoverPassable,
  statesEqual,
} from "@/lib/battler_mutations.ts";
import {
  canJoinAsPlayer,
  getBattlerPermissions,
  type BattlerPermissions,
} from "@/lib/battler_turn.ts";
import {
  generateRectangularGrid,
  HEX_SIZE,
  hexCorners,
  hexToPixel,
  pixelToHex,
  type Point,
} from "@/lib/hex-grid.ts";

// --- View / interaction constants ---
const MIN_SCALE = 0.35;
const MAX_SCALE = 4.0;
const ZOOM_FACTOR = 1.15;
const INITIAL_GRID = generateRectangularGrid(-7, 7, -6, 6);
const STORAGE_KEY = "wvo-hex-battler-v1";
const AUTOSAVE_DEBOUNCE_MS = 350;
const LOBBY_SAVE_DEBOUNCE_MS = 500;
const POLL_MS = 2500;

interface HexGridBattlerProps {
  user: SessionUser | null;
  /** Anti-spam: moderator-approved (or grandfathered) account. */
  isValidated?: boolean;
  mode: "local" | "online";
  battleId?: string;
  initialRoom?: BattleRoom;
}

function loadLocalState(): BattlerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = parseBattlerState(JSON.parse(raw));
      if (parsed) return parsed;
    }
  } catch {
    // ignore
  }
  return createEmptyBattlerState();
}

export default function HexGridBattler({
  user,
  isValidated = false,
  mode,
  battleId,
  initialRoom,
}: HexGridBattlerProps) {
  const isOnline = mode === "online" && !!battleId;

  // --- Online room ---
  const [room, setRoom] = useState<BattleRoom | null>(
    initialRoom ?? null,
  );
  const [roomError, setRoomError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Board state: local sandbox OR online draft/display
  const [state, setState] = useState<BattlerState>(() => {
    if (isOnline && initialRoom) return cloneBattlerState(initialRoom.state);
    if (!isOnline) return loadLocalState();
    return createEmptyBattlerState();
  });

  // Snapshot of state at start of our turn (for dirty detection / force-end discard)
  const turnStartRef = useRef<BattlerState | null>(null);
  const lastTurnKeyRef = useRef<string>("");

  const perms: BattlerPermissions = useMemo(() => {
    if (!isOnline || !room) {
      return {
        canEdit: true,
        canEndTurn: false,
        isOwner: false,
        isPlayer: false,
        isActive: false,
        isSpectator: false,
        activePlayer: null,
      };
    }
    return getBattlerPermissions(room, user?.id ?? null);
  }, [isOnline, room, user?.id]);

  const canEdit = isOnline ? perms.canEdit : true;

  // View transform
  const view = useSignal({ scale: 1.0, tx: 0, ty: 0 });
  const [modeTool, setModeTool] = useState<ToolMode>("select");
  const [showCoords, setShowCoords] = useState(true);
  const [placingCombatantId, setPlacingCombatantId] = useState<string | null>(
    null,
  );
  const [placingCoverType, setPlacingCoverType] = useState<CoverType | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedHexKey, setSelectedHexKey] = useState<string | null>(null);

  const dragState = useSignal<
    { combatantId: string; worldX: number; worldY: number } | null
  >(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importQuery, setImportQuery] = useState("");
  const [importResults, setImportResults] = useState<
    { mine: ImportableCharacter[]; public: ImportableCharacter[] } | null
  >(null);
  const [importLoading, setImportLoading] = useState(false);
  const importDebounceRef = useRef<number | null>(null);

  const isPanning = useRef(false);
  const lastPointer = useRef<Point>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingTokenRef = useRef<
    { id: string; offsetX: number; offsetY: number } | null
  >(null);

  // Apply mutator only when allowed
  const mutate = useCallback(
    (fn: (s: BattlerState) => BattlerState) => {
      if (!canEdit) return;
      setState((s) => fn(s));
    },
    [canEdit],
  );

  /** Apply a server room after a mutation; forceReset reloads board from server. */
  function applyRoom(next: BattleRoom, opts?: { forceDraftReset?: boolean }) {
    if (opts?.forceDraftReset) {
      lastTurnKeyRef.current = "";
      turnStartRef.current = null;
      setState(cloneBattlerState(next.state));
    }
    setRoom(next);
  }

  // Poll online battle
  useEffect(() => {
    if (!isOnline || !battleId) return;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/battler/battles/${battleId}`);
        if (!res.ok) {
          if (res.status === 404) setRoomError("Battle not found");
          return;
        }
        const data = await res.json() as BattleRoom;
        if (cancelled) return;

        setRoom((prev) => {
          if (!prev) return data;

          const unchanged =
            data.stateRevision === prev.stateRevision &&
            data.turnNumber === prev.turnNumber &&
            data.status === prev.status &&
            data.currentTurnIndex === prev.currentTurnIndex &&
            data.name === prev.name &&
            JSON.stringify(data.players) === JSON.stringify(prev.players) &&
            JSON.stringify(data.state) === JSON.stringify(prev.state);

          if (unchanged) return prev;
          return data;
        });
      } catch {
        // network blip — ignore
      }
    }

    if (!initialRoom) poll();

    const handle = setInterval(() => {
      if (document.visibilityState === "visible") poll();
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(handle);
    };
  }, [isOnline, battleId, initialRoom]);

  // When room snapshot changes, update local board (respect active draft)
  useEffect(() => {
    if (!isOnline || !room) return;

    const p = getBattlerPermissions(room, user?.id ?? null);
    const turnKey =
      `${room.turnNumber}:${room.currentTurnIndex}:${room.status}:${room.stateRevision}`;

    if (room.status === "lobby" && p.isOwner) {
      // Owner owns local board; only adopt server if we have no local divergence
      // on first paint of a new revision from another tab of the same owner — skip.
      // On join as owner after reload, state is already from SSR/initial.
      if (lastTurnKeyRef.current === "") {
        setState(cloneBattlerState(room.state));
        lastTurnKeyRef.current = turnKey;
      } else if (!lastTurnKeyRef.current.startsWith(`${room.turnNumber}:`)) {
        // status changed (e.g. after start elsewhere) — handled below paths
        lastTurnKeyRef.current = turnKey;
      }
      return;
    }

    if (room.status === "active" && p.isActive) {
      if (lastTurnKeyRef.current !== turnKey) {
        // New turn for us (or force-end advanced revision) — take server state
        setState(cloneBattlerState(room.state));
        turnStartRef.current = cloneBattlerState(room.state);
        lastTurnKeyRef.current = turnKey;
      }
      return;
    }

    // Spectator / waiting / ended / lobby non-owner
    setState(cloneBattlerState(room.state));
    turnStartRef.current = null;
    lastTurnKeyRef.current = turnKey;
  }, [
    isOnline,
    room?.stateRevision,
    room?.turnNumber,
    room?.currentTurnIndex,
    room?.status,
    room?.players,
    room?.state,
    user?.id,
  ]);

  // Local sandbox autosave
  useEffect(() => {
    if (isOnline) return;
    const handle = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // ignore
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [state, isOnline]);

  // Lobby owner: debounced commit of board state
  useEffect(() => {
    if (!isOnline || !room || !battleId) return;
    if (room.status !== "lobby") return;
    if (!perms.isOwner) return;
    if (statesEqual(state, room.state)) return;

    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/battler/battles/${battleId}/lobby`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state }),
        });
        if (res.ok) {
          const data = await res.json() as BattleRoom;
          setRoom(data);
        }
      } catch {
        // ignore
      }
    }, LOBBY_SAVE_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [state, isOnline, room?.status, room?.stateRevision, perms.isOwner, battleId]);

  // --- Coordinate helpers ---
  const screenToWorld = useCallback((p: Point): Point => {
    const v = view.value;
    return {
      x: (p.x - v.tx) / v.scale,
      y: (p.y - v.ty) / v.scale,
    };
  }, []);

  const zoomBy = useCallback((factor: number, center?: Point) => {
    const v = view.value;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, v.scale * factor));
    if (!center || !svgRef.current) {
      view.value = { ...v, scale: newScale };
      return;
    }
    const worldBefore = screenToWorld(center);
    view.value = {
      scale: newScale,
      tx: center.x - worldBefore.x * newScale,
      ty: center.y - worldBefore.y * newScale,
    };
  }, [screenToWorld]);

  const resetView = useCallback(() => {
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

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const factor = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    zoomBy(factor, mouse);
  }, [zoomBy]);

  const onPointerDown = useCallback((e: PointerEvent) => {
    if (modeTool !== "select") return;
    if (placingCombatantId) return;
    if (draggingTokenRef.current) return;
    const svg = svgRef.current;
    if (!svg) return;
    svg.setPointerCapture(e.pointerId);
    isPanning.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  }, [modeTool, placingCombatantId]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const worldPos = screenToWorld({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

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

    if (draggingTokenRef.current && dragState.value) {
      if (canEdit) {
        const { id: combatantId } = draggingTokenRef.current;
        const targetHex = pixelToHex(
          dragState.value.worldX,
          dragState.value.worldY,
        );
        mutate((s) => placeCombatantOnHex(s, combatantId, targetHex));
      }
      draggingTokenRef.current = null;
      dragState.value = null;
    }
    isPanning.current = false;
  }, [canEdit, mutate]);

  const onBackgroundClick = useCallback(() => {
    if (placingCombatantId) {
      setPlacingCombatantId(null);
    } else if (modeTool === "place-cover") {
      setModeTool("select");
      setPlacingCoverType(null);
    } else {
      setSelectedId(null);
      setSelectedHexKey(null);
    }
  }, [placingCombatantId, modeTool]);

  useEffect(() => {
    const t = setTimeout(() => resetView(), 60);
    return () => clearTimeout(t);
  }, [resetView]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (placingCombatantId) {
          e.preventDefault();
          setPlacingCombatantId(null);
        } else if (modeTool === "place-cover") {
          e.preventDefault();
          setModeTool("select");
          setPlacingCoverType(null);
        } else if (showImportModal) {
          e.preventDefault();
          setShowImportModal(false);
        }
      }
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [placingCombatantId, modeTool, showImportModal]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => onWheel(e);
    svg.addEventListener("wheel", handler, { passive: false });
    return () => svg.removeEventListener("wheel", handler);
  }, [onWheel]);

  // --- Roster actions ---
  const addDummy = () => {
    if (!canEdit) return;
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
    mutate((s) => addCombatant(s, dummy));
  };

  const resetBattle = () => {
    if (isOnline) return;
    if (
      !confirm(
        "Start a completely new battle? This clears the roster and grid (local copy is autosaved).",
      )
    ) return;
    setState(createEmptyBattlerState());
    setPlacingCombatantId(null);
    setSelectedId(null);
    setSelectedHexKey(null);
    resetView();
  };

  function handleTokenPointerDown(
    e: PointerEvent,
    combatantId: string,
    currentCenter: Point,
  ) {
    if (!canEdit || modeTool !== "select") return;
    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const worldPos = screenToWorld({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    draggingTokenRef.current = {
      id: combatantId,
      offsetX: worldPos.x - currentCenter.x,
      offsetY: worldPos.y - currentCenter.y,
    };
    setSelectedId(combatantId);
    setSelectedHexKey(null);
    dragState.value = {
      combatantId,
      worldX: currentCenter.x,
      worldY: currentCenter.y,
    };
    svg.setPointerCapture(e.pointerId);
  }

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
        setImportResults(await res.json());
      } else {
        setImportResults({ mine: [], public: [] });
      }
    } catch {
      setImportResults({ mine: [], public: [] });
    } finally {
      setImportLoading(false);
    }
  }

  function importCharacter(char: ImportableCharacter) {
    if (!canEdit) return;
    const newCombatant: Combatant = {
      id: crypto.randomUUID(),
      name: char.name,
      currentHealth: char.maxHealth,
      maxHealth: char.maxHealth,
      team: "neutral",
      characterId: char.id,
    };
    mutate((s) => addCombatant(s, newCombatant));
  }

  // --- Online actions ---
  async function apiPost(path: string, body?: unknown): Promise<BattleRoom | null> {
    setBusy(true);
    setRoomError(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRoomError(data.error ?? `Request failed (${res.status})`);
        if (res.status === 409 && battleId) {
          // resync
          const r = await fetch(`/api/battler/battles/${battleId}`);
          if (r.ok) {
            const fresh = await r.json() as BattleRoom;
            applyRoom(fresh, { forceDraftReset: true });
          }
        }
        return null;
      }
      applyRoom(data as BattleRoom, { forceDraftReset: true });
      return data as BattleRoom;
    } catch (e) {
      setRoomError(String((e as Error).message ?? e));
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    if (!battleId) return;
    await apiPost(`/api/battler/battles/${battleId}/join`);
  }

  async function handleStart() {
    if (!battleId) return;
    // flush lobby state first
    if (room?.status === "lobby" && perms.isOwner) {
      await fetch(`/api/battler/battles/${battleId}/lobby`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
    }
    await apiPost(`/api/battler/battles/${battleId}/start`);
  }

  async function handleEndTurn() {
    if (!battleId || !room) return;
    await apiPost(`/api/battler/battles/${battleId}/end-turn`, {
      state,
      expectedRevision: room.stateRevision,
    });
  }

  async function handleForceEndTurn() {
    if (!battleId || !room) return;
    if (
      !confirm(
        "Force-end this turn? The active player's uncommitted changes will be discarded.",
      )
    ) return;
    await apiPost(`/api/battler/battles/${battleId}/force-end-turn`, {
      expectedRevision: room.stateRevision,
    });
  }

  async function handleEndBattle() {
    if (!battleId) return;
    if (!confirm("End this battle? Everyone becomes read-only.")) return;
    await apiPost(`/api/battler/battles/${battleId}/end`);
  }

  async function handleRenameBattle() {
    if (!battleId || !room || !perms.isOwner) return;
    const next = prompt("Battle name", room.name ?? "")?.trim();
    if (next === undefined) return; // cancelled
    // Empty string clears to untitled
    setBusy(true);
    setRoomError(null);
    try {
      const res = await fetch(`/api/battler/battles/${battleId}/name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: next || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRoomError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      applyRoom(data as BattleRoom);
      // Keep document title in sync when possible
      try {
        const label = (data as BattleRoom).name || "Battle";
        document.title = `${label} • Hex Battler • World Vore One`;
      } catch {
        // ignore
      }
    } catch (e) {
      setRoomError(String((e as Error).message ?? e));
    } finally {
      setBusy(false);
    }
  }

  async function movePlayer(index: number, dir: -1 | 1) {
    if (!battleId || !room || !perms.isOwner || room.status !== "lobby") return;
    const next = index + dir;
    if (next < 0 || next >= room.players.length) return;
    const players = [...room.players];
    const tmp = players[index];
    players[index] = players[next];
    players[next] = tmp;
    setBusy(true);
    try {
      const res = await fetch(`/api/battler/battles/${battleId}/lobby`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players }),
      });
      if (res.ok) {
        applyRoom(await res.json(), { forceDraftReset: false });
      }
    } finally {
      setBusy(false);
    }
  }

  function copyLink() {
    const url = globalThis.location.href;
    navigator.clipboard?.writeText(url).catch(() => {
      prompt("Copy this link:", url);
    });
  }

  const dirty = isOnline && perms.isActive && turnStartRef.current
    ? !statesEqual(state, turnStartRef.current)
    : false;

  // --- Render helpers ---
  const hexElements = INITIAL_GRID.map((hex) => {
    const center = hexToPixel(hex);
    const corners = hexCorners(center);
    const points = corners.map((p) => `${p.x},${p.y}`).join(" ");
    const key = coordKey(hex);
    const isSelectedHex = selectedHexKey === key;

    return (
      <g key={key}>
        <polygon
          points={points}
          fill="currentColor"
          fill-opacity={isSelectedHex ? "0.12" : "0.035"}
          stroke={isSelectedHex ? "#3b82f6" : "currentColor"}
          stroke-width={isSelectedHex ? 2.5 : 1.5}
          stroke-opacity={isSelectedHex ? 0.9 : 0.35}
          class="pointer-events-auto"
          pointer-events="all"
          onClick={(e) => {
            e.stopPropagation();
            if (placingCombatantId && canEdit) {
              mutate((s) =>
                placeCombatantOnHex(s, placingCombatantId, hex)
              );
              setPlacingCombatantId(null);
            } else if (
              modeTool === "place-cover" && placingCoverType && canEdit
            ) {
              mutate((s) => placeCoverOnHex(s, placingCoverType, hex));
            } else {
              setSelectedHexKey(key);
              setSelectedId(null);
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

  const coverFillElements = Object.entries(state.covers).map(([key, cover]) => {
    const hex = parseCoordKey(key);
    const center = hexToPixel(hex);
    const corners = hexCorners(center);
    const points = corners.map((p) => `${p.x},${p.y}`).join(" ");
    return (
      <polygon
        key={`coverfill-${key}`}
        points={points}
        fill={`url(#cover-${cover.type})`}
        stroke="none"
        pointer-events="none"
      />
    );
  });

  const v = view.value;
  const selectedCombatant = selectedId
    ? state.combatants.find((c) => c.id === selectedId) ?? null
    : null;
  const selectedCover = selectedHexKey
    ? state.covers[selectedHexKey] ?? null
    : null;
  const selectedOccupantId = selectedHexKey
    ? state.placedCharacters[selectedHexKey] ?? null
    : null;

  const statusBanner = (() => {
    if (!isOnline || !room) return null;
    if (room.status === "lobby") {
      return perms.isOwner
        ? "Lobby — set up the board, then Start Battle"
        : "Lobby — waiting for host to start";
    }
    if (room.status === "ended") return "Battle ended — read only";
    if (perms.isActive) {
      return dirty
        ? "Your turn — uncommitted changes (saved on End Turn)"
        : "Your turn";
    }
    if (perms.activePlayer) {
      return `Waiting for ${perms.activePlayer.username}…`;
    }
    return "Spectating";
  })();

  return (
    <>
      {/* Online chrome */}
      {isOnline && room && (
        <div class="border-b border-base-300 bg-base-100 px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
          {perms.isOwner
            ? (
              <button
                type="button"
                class="font-semibold text-sm hover:underline max-w-[12rem] sm:max-w-xs truncate text-left"
                title="Click to rename battle"
                disabled={busy}
                onClick={handleRenameBattle}
              >
                {room.name || "Untitled battle"}
              </button>
            )
            : (
              <span class="font-semibold text-sm max-w-[12rem] sm:max-w-xs truncate">
                {room.name || "Untitled battle"}
              </span>
            )}
          <span
            class={`px-2 py-0.5 rounded font-medium ${
              perms.isActive
                ? "bg-primary text-primary-content"
                : room.status === "lobby"
                ? "bg-warning/20 text-warning-content"
                : "bg-base-200"
            }`}
          >
            {statusBanner}
          </span>
          <span class="text-base-content/60">
            {room.status} · turn #{room.turnNumber} · rev {room.stateRevision}
          </span>
          {perms.isOwner && (
            <button
              type="button"
              class="btn btn-ghost btn-xs"
              disabled={busy}
              onClick={handleRenameBattle}
              title="Rename battle"
            >
              Rename
            </button>
          )}
          <button
            type="button"
            class="btn btn-ghost btn-xs"
            onClick={copyLink}
            title="Copy public spectator/player link"
          >
            Copy link
          </button>
          {canJoinAsPlayer(room, user?.id ?? null) && user && isValidated && (
            <button
              type="button"
              class="btn btn-primary btn-xs"
              disabled={busy}
              onClick={handleJoin}
            >
              Join as player
            </button>
          )}
          {canJoinAsPlayer(room, user?.id ?? null) && user && !isValidated && (
            <span
              class="text-xs text-warning"
              title="Submit a character sheet and wait for moderator approval"
            >
              Approved character required to join
            </span>
          )}
          {!user && (
            <a href="/auth/discord" class="link link-primary text-xs">
              Log in to join as player
            </a>
          )}
          {perms.isOwner && room.status === "lobby" && (
            <button
              type="button"
              class="btn btn-primary btn-xs"
              disabled={busy || room.players.length === 0}
              onClick={handleStart}
            >
              Start battle
            </button>
          )}
          {perms.canEndTurn && (
            <button
              type="button"
              class="btn btn-primary btn-xs"
              disabled={busy}
              onClick={handleEndTurn}
            >
              End turn
            </button>
          )}
          {perms.isOwner && room.status === "active" && (
            <button
              type="button"
              class="btn btn-warning btn-xs"
              disabled={busy}
              onClick={handleForceEndTurn}
            >
              Force end turn
            </button>
          )}
          {perms.isOwner && room.status !== "ended" && (
            <button
              type="button"
              class="btn btn-ghost btn-xs text-error"
              disabled={busy}
              onClick={handleEndBattle}
            >
              End battle
            </button>
          )}
          {roomError && (
            <span class="text-error ml-auto">{roomError}</span>
          )}
        </div>
      )}

      <div class="flex flex-1 overflow-hidden">
        {/* Left: Roster + players */}
        <aside class="w-72 min-w-64 max-w-80 border-r border-base-300 bg-base-100 flex flex-col overflow-hidden">
          {isOnline && room && (
            <div class="p-2 border-b border-base-300 bg-base-200/40">
              <div class="font-semibold text-xs mb-1">Players (turn order)</div>
              <ul class="space-y-0.5 text-xs">
                {room.players.map((p, i) => {
                  const isCurrent = room.status === "active" &&
                    i === room.currentTurnIndex;
                  return (
                    <li
                      key={p.userId}
                      class={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                        isCurrent ? "bg-primary/15 font-medium" : ""
                      }`}
                    >
                      <span class="truncate flex-1">
                        {p.username}
                        {p.userId === room.ownerId ? " (host)" : ""}
                        {isCurrent ? " ←" : ""}
                      </span>
                      {perms.isOwner && room.status === "lobby" && (
                        <span class="flex gap-0.5">
                          <button
                            type="button"
                            class="px-1 hover:bg-base-300 rounded"
                            disabled={i === 0}
                            onClick={() => movePlayer(i, -1)}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            class="px-1 hover:bg-base-300 rounded"
                            disabled={i === room.players.length - 1}
                            onClick={() => movePlayer(i, 1)}
                          >
                            ↓
                          </button>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {perms.isSpectator && (
                <div class="text-[10px] text-base-content/50 mt-1">
                  Spectating — full board visible
                </div>
              )}
            </div>
          )}

          <div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-200/60">
            <div>
              <div class="font-semibold">Roster</div>
              <div class="text-xs text-base-content/60">
                {state.combatants.length} combatants
                {!canEdit && " · read-only"}
              </div>
            </div>
            {canEdit && (
              <div class="flex gap-1">
                <button
                  type="button"
                  onClick={addDummy}
                  class="px-2.5 py-1 text-xs border rounded bg-base-100 hover:bg-base-200"
                >
                  + Dummy
                </button>
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportModal(true);
                      setImportQuery("");
                      loadImportResults("");
                    }}
                    class="px-2.5 py-1 text-xs border rounded bg-base-100 hover:bg-base-200"
                  >
                    Import
                  </button>
                )}
              </div>
            )}
          </div>

          <div class="flex-1 overflow-auto p-2 space-y-1 text-sm">
            {state.combatants.length === 0 && (
              <div class="px-2 py-6 text-center text-base-content/60 text-xs">
                No characters yet.
                {canEdit && (
                  <>
                    <br />Add dummies or import real sheets.
                  </>
                )}
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
                  onClick={() => {
                    setSelectedId(c.id);
                    setSelectedHexKey(null);
                  }}
                >
                  <button
                    type="button"
                    disabled={!canEdit}
                    onClick={(e) => {
                      e.stopPropagation();
                      mutate((s) => cycleTeam(s, c.id));
                    }}
                    class="w-3 h-3 rounded-full shrink-0 border border-base-300 disabled:opacity-60"
                    style={{ backgroundColor: TEAM_COLORS[c.team] }}
                    title="Cycle team"
                  />
                  <div class="min-w-0 flex-1">
                    <button
                      type="button"
                      disabled={!canEdit}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!canEdit) return;
                        const newName = prompt("Rename combatant", c.name)
                          ?.trim();
                        if (!newName || newName === c.name) return;
                        mutate((s) => setCombatantName(s, c.id, newName));
                      }}
                      class="font-medium truncate hover:underline text-left w-full flex items-center gap-1.5 disabled:no-underline"
                    >
                      {c.name}
                      {c.label && (
                        <span class="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded bg-base-300 shrink-0">
                          {c.label}
                        </span>
                      )}
                    </button>
                    <div class="flex items-center gap-1 text-[10px] tabular-nums text-base-content/80 mt-0.5">
                      {canEdit && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              mutate((s) => adjustHealth(s, c.id, -5));
                            }}
                            class="px-1 rounded hover:bg-base-200"
                          >
                            −5
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              mutate((s) => adjustHealth(s, c.id, -1));
                            }}
                            class="px-1 rounded hover:bg-base-200"
                          >
                            −1
                          </button>
                        </>
                      )}
                      <span class="font-medium px-0.5">
                        {c.currentHealth} / {c.maxHealth}
                      </span>
                      {canEdit && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              mutate((s) => adjustHealth(s, c.id, 1));
                            }}
                            class="px-1 rounded hover:bg-base-200"
                          >
                            +1
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              mutate((s) => adjustHealth(s, c.id, 5));
                            }}
                            class="px-1 rounded hover:bg-base-200"
                          >
                            +5
                          </button>
                        </>
                      )}
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
                    {canEdit && (
                      onGrid
                        ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              mutate((s) => removeFromGrid(s, c.id));
                            }}
                            class="text-primary hover:underline"
                          >
                            Remove from grid
                          </button>
                        )
                        : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlacingCombatantId(c.id);
                              setModeTool("select");
                              setPlacingCoverType(null);
                            }}
                            class="text-primary hover:underline font-medium"
                          >
                            Deploy to grid
                          </button>
                        )
                    )}
                    {canEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            !confirm(
                              `Remove "${c.name}" from the battle?`,
                            )
                          ) return;
                          mutate((s) => removeCombatant(s, c.id));
                          if (selectedId === c.id) setSelectedId(null);
                        }}
                        class="text-error/70 hover:text-error"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div class="p-2 text-[10px] text-base-content/50 border-t border-base-300 flex gap-2">
            {!isOnline && (
              <button
                type="button"
                onClick={resetBattle}
                class="text-error/80 hover:text-error underline"
              >
                New Battle
              </button>
            )}
            <span class="flex-1" />
            <span>
              {isOnline
                ? (canEdit
                  ? (room?.status === "lobby"
                    ? "lobby autosaves"
                    : "draft until End Turn")
                  : "view only")
                : "autosaves locally"}
            </span>
          </div>
        </aside>

        {/* Center grid */}
        <main class="flex-1 relative overflow-hidden bg-base-100 select-none">
          <svg
            ref={svgRef}
            class="absolute inset-0 w-full h-full touch-none"
            style={{
              cursor: isPanning.current
                ? "grabbing"
                : placingCombatantId || modeTool === "place-cover"
                ? "crosshair"
                : "grab",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onClick={onBackgroundClick}
          >
            <defs>
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

            <g transform={`translate(${v.tx} ${v.ty}) scale(${v.scale})`}>
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
              {hexElements}
              {coverFillElements}

              {Object.entries(state.placedCharacters).map(
                ([key, combatantId]) => {
                  if (dragState.value?.combatantId === combatantId) return null;
                  const c = state.combatants.find((x) => x.id === combatantId);
                  if (!c) return null;
                  const coord = parseCoordKey(key);
                  const center = hexToPixel(coord);
                  const color = TEAM_COLORS[c.team];
                  const isSelected = selectedId === combatantId;
                  const displayLabel = c.label ??
                    c.name.slice(0, 2).toUpperCase();
                  const isSingleLetterLabel = Boolean(c.label);

                  return (
                    <g
                      key={`token-${combatantId}`}
                      class={canEdit ? "cursor-move" : "cursor-pointer"}
                      onPointerDown={(e) =>
                        handleTokenPointerDown(e, combatantId, center)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(combatantId);
                        setSelectedHexKey(key);
                      }}
                    >
                      <circle
                        cx={center.x}
                        cy={center.y}
                        r={HEX_SIZE * 0.42}
                        fill={color}
                        fill-opacity="0.92"
                        stroke={isSelected ? "#fde047" : "#111827"}
                        stroke-width={isSelected ? 4 : 2.5}
                      />
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

          {placingCombatantId && canEdit && (
            <div class="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-content text-xs px-3 py-1 rounded-full shadow flex items-center gap-3">
              Click a hex to deploy •
              <button
                type="button"
                onClick={() => setPlacingCombatantId(null)}
                class="underline hover:no-underline font-medium"
              >
                Cancel (ESC)
              </button>
            </div>
          )}

          <div class="absolute top-3 left-3 bg-base-100/95 border border-base-300 rounded-lg shadow-sm px-2 py-1.5 flex items-center gap-2 text-sm z-10">
            <button
              type="button"
              onClick={() => {
                setModeTool("select");
                setPlacingCoverType(null);
              }}
              class={`px-2 py-0.5 rounded ${
                modeTool === "select"
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200"
              }`}
            >
              Select / Pan
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  setModeTool("place-cover");
                  setSelectedId(null);
                  if (!placingCoverType) setPlacingCoverType("weak");
                }}
                class={`px-2 py-0.5 rounded ${
                  modeTool === "place-cover"
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }`}
              >
                Place Cover
              </button>
            )}
            {canEdit && modeTool === "place-cover" && (
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
            <div class="w-px h-4 bg-base-300 mx-1" />
            <button
              type="button"
              onClick={() => zoomBy(1 / ZOOM_FACTOR)}
              class="px-1.5 hover:bg-base-200 rounded"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => zoomBy(ZOOM_FACTOR)}
              class="px-1.5 hover:bg-base-200 rounded"
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

          <div class="absolute bottom-2 right-3 text-[10px] px-2 py-0.5 bg-base-100/80 border border-base-300 rounded text-base-content/60 tabular-nums">
            Scale {v.scale.toFixed(2)}× · {INITIAL_GRID.length} hexes
          </div>
        </main>

        {/* Inspector */}
        <aside class="w-64 border-l border-base-300 bg-base-100 p-3 text-sm hidden xl:block overflow-auto">
          <div class="font-semibold mb-2">Inspector</div>
          {!selectedCombatant && !selectedHexKey && (
            <div class="text-xs text-base-content/60">
              Select a token or hex for details.
            </div>
          )}
          {selectedCombatant && (
            <div class="space-y-2 text-xs">
              <div class="font-medium text-sm">{selectedCombatant.name}</div>
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 rounded-full border"
                  style={{
                    backgroundColor: TEAM_COLORS[selectedCombatant.team],
                  }}
                />
                <span class="capitalize">{selectedCombatant.team}</span>
                {selectedCombatant.label && (
                  <span class="badge badge-sm">
                    {selectedCombatant.label}
                  </span>
                )}
              </div>
              <div class="tabular-nums">
                HP {selectedCombatant.currentHealth} /{" "}
                {selectedCombatant.maxHealth}
              </div>
              {canEdit && (
                <button
                  type="button"
                  class="btn btn-xs btn-outline"
                  onClick={() => {
                    const v = prompt(
                      "Max HP",
                      String(selectedCombatant.maxHealth),
                    );
                    if (v == null) return;
                    const n = Number(v);
                    if (!Number.isFinite(n)) return;
                    mutate((s) =>
                      setCombatantMaxHealth(s, selectedCombatant.id, n)
                    );
                  }}
                >
                  Edit max HP
                </button>
              )}
              {selectedCombatant.characterId && (
                <a
                  href={`/characters/${selectedCombatant.characterId}`}
                  class="link link-primary block"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open character sheet
                </a>
              )}
            </div>
          )}
          {selectedHexKey && (
            <div class="mt-4 space-y-2 text-xs border-t border-base-300 pt-3">
              <div class="font-medium">Hex {selectedHexKey}</div>
              {selectedOccupantId && (
                <div>
                  Occupant:{" "}
                  {state.combatants.find((c) => c.id === selectedOccupantId)
                    ?.name ?? selectedOccupantId}
                </div>
              )}
              {selectedCover
                ? (
                  <>
                    <div>
                      Cover: {COVER_LABELS[selectedCover.type]}
                    </div>
                    <div>
                      Passable: {selectedCover.passable ? "yes" : "no"}
                    </div>
                    {canEdit && (
                      <div class="flex flex-wrap gap-1">
                        <button
                          type="button"
                          class="btn btn-xs btn-outline"
                          onClick={() =>
                            mutate((s) =>
                              setCoverPassable(
                                s,
                                selectedHexKey,
                                !selectedCover.passable,
                              )
                            )}
                        >
                          Toggle passable
                        </button>
                        <button
                          type="button"
                          class="btn btn-xs btn-error btn-outline"
                          onClick={() => {
                            mutate((s) => removeCover(s, selectedHexKey));
                          }}
                        >
                          Remove cover
                        </button>
                      </div>
                    )}
                  </>
                )
                : <div class="text-base-content/60">No cover</div>}
            </div>
          )}
          <div class="mt-6 text-[10px] text-base-content/50">
            Mode: <span class="font-mono">{modeTool}</span>
            {isOnline && room && (
              <>
                <br />
                Room: <span class="font-mono">{room.status}</span>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Import modal */}
      {showImportModal && (
        <div
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImportModal(false)}
        >
          <div
            class="bg-base-100 border border-base-300 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="flex items-center justify-between px-4 py-3 border-b border-base-300">
              <div>
                <div class="font-semibold">Import Characters from Sheets</div>
                <div class="text-xs text-base-content/60">
                  Your characters + approved public ones
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                class="text-xl leading-none px-2 text-base-content/60"
              >
                ×
              </button>
            </div>
            <div class="p-4 border-b border-base-300">
              <input
                type="text"
                value={importQuery}
                onInput={(e) => {
                  const val = (e.target as HTMLInputElement).value;
                  setImportQuery(val);
                  if (importDebounceRef.current) {
                    clearTimeout(importDebounceRef.current);
                  }
                  importDebounceRef.current = setTimeout(() => {
                    loadImportResults(val);
                  }, 250) as unknown as number;
                }}
                placeholder="Search by name or race..."
                class="w-full px-3 py-2 border border-base-300 rounded bg-base-100 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div class="flex-1 overflow-auto p-4 space-y-6 text-sm">
              {importLoading && (
                <div class="text-center text-base-content/60 py-8">
                  Loading characters...
                </div>
              )}
              {!importLoading && importResults && (
                <>
                  {(
                    [
                      ["Your Characters", importResults.mine],
                      ["Public / Approved", importResults.public],
                    ] as const
                  ).map(([title, list]) => (
                    <div key={title}>
                      <div class="font-medium mb-2 text-base-content/80">
                        {title} ({list.length})
                      </div>
                      {list.length === 0 && (
                        <div class="text-xs text-base-content/50 pl-1">
                          No matches.
                        </div>
                      )}
                      <div class="space-y-1">
                        {list.map((c) => (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => importCharacter(c)}
                            disabled={!canEdit}
                            class="w-full text-left px-3 py-2 border border-base-300 rounded hover:bg-base-200 flex justify-between items-center disabled:opacity-50"
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
                  ))}
                </>
              )}
            </div>
            <div class="p-3 border-t border-base-300 text-[10px] text-base-content/50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                class="underline"
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
