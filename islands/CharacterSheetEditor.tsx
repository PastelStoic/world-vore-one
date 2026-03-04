import { useRef, useState } from "preact/hooks";
import {
  PERK_CATEGORY_LABELS,
  PERK_CATEGORY_ORDER,
  type PerkCategory,
  type PerkDefinition,
  PERKS_BY_ID,
} from "@/data/perks.ts";
import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type CharacterDescription,
  type CharacterDraft,
  type CharacterSheet,
  FACTIONS,
  getRacesForSex,
  getStartingStatPoints,
  isPilzRace,
  mapRaceForSex,
  PERK_COST_STAT_POINTS,
  type Sex,
  SEX_OPTIONS,
} from "@/lib/character_types.ts";
import { calculatePerksCost, getDerivedPerkIds } from "@/lib/characters.ts";
import { useCharacterStats } from "@/lib/useCharacterStats.ts";
import OtherStatsSection from "@/components/OtherStatsSection.tsx";
import EncumbranceSection from "@/components/EncumbranceSection.tsx";
import PerkDescription from "@/components/PerkDescription.tsx";
import InventorySection from "@/components/InventorySection.tsx";
import type { CharacterInventory } from "@/lib/inventory_types.ts";
import {
  calculateInventoryPointCost,
  createEmptyInventory,
} from "@/lib/inventory_types.ts";
import {
  ATTACHMENTS_BY_ID,
  EQUIPMENT_BY_ID,
  WEAPONS_BY_ID,
} from "@/data/equipment.ts";

interface CharacterSheetEditorProps {
  action: "create" | "update";
  title: string;
  submitLabel: string;
  characterId?: string;
  basedOnSnapshotId?: string;
  initialCharacter: CharacterDraft | CharacterSheet;
  perks: PerkDefinition[];
  /** Cloudflare Images delivery URL for existing character image */
  imageUrl?: string;
  /** Whether the character is still pending admin approval */
  isPending?: boolean;
}

export default function CharacterSheetEditor(props: CharacterSheetEditorProps) {
  const [name, setName] = useState(props.initialCharacter.name);
  const [race, setRace] = useState(props.initialCharacter.race);
  const [description, setDescription] = useState<CharacterDescription>(
    props.initialCharacter.description,
  );
  const [initialBaseStats] = useState(props.initialCharacter.baseStats);
  const [baseStats, setBaseStats] = useState(props.initialCharacter.baseStats);
  const [initialPerkIds] = useState(props.initialCharacter.perkIds);
  const [initialPerkRanks] = useState(props.initialCharacter.perkRanks ?? {});
  const [unallocatedStatPoints, setUnallocatedStatPoints] = useState(
    props.initialCharacter.unallocatedStatPoints,
  );
  const [perkIds, setPerkIds] = useState(props.initialCharacter.perkIds);
  const [perkNotes, setPerkNotes] = useState<Record<string, string>>(
    props.initialCharacter.perkNotes ?? {},
  );
  const [perkUpgradeNotes, setPerkUpgradeNotes] = useState<
    Record<string, string[]>
  >(() => {
    const result = { ...(props.initialCharacter.perkUpgradeNotes ?? {}) };
    // Migrate existing perkNotes entries for upgradable perks
    for (const perkId of props.initialCharacter.perkIds) {
      const perk = PERKS_BY_ID.get(perkId);
      if (perk?.upgradable && perk.customInput && !result[perkId]) {
        const oldNote = props.initialCharacter.perkNotes?.[perkId];
        if (oldNote) result[perkId] = [oldNote];
      }
    }
    return result;
  });
  const [perkStatChoices, setPerkStatChoices] = useState<
    Record<string, BaseStatKey[]>
  >(props.initialCharacter.perkStatChoices ?? {});
  const [perkRanks, setPerkRanks] = useState<Record<string, number>>(
    props.initialCharacter.perkRanks ?? {},
  );
  const [perkDisguises, setPerkDisguises] = useState<Record<string, string>>(
    props.initialCharacter.perkDisguises ?? {},
  );
  const [inventory, setInventory] = useState<CharacterInventory>(
    props.initialCharacter.inventory ?? createEmptyInventory(),
  );
  const [changelog, setChangelog] = useState("");
  const [showDescription, setShowDescription] = useState(true);
  const [showPerkPicker, setShowPerkPicker] = useState(false);
  const [perkCategoryFilter, setPerkCategoryFilter] = useState<
    PerkCategory | ""
  >("");
  const [perkSearchFilter, setPerkSearchFilter] = useState("");

  // Image upload state
  const [currentImageUrl, setCurrentImageUrl] = useState(props.imageUrl ?? "");
  const [pendingImageId, setPendingImageId] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const draft: CharacterDraft = {
    name,
    race,
    description,
    baseStats,
    unallocatedStatPoints,
    perkIds,
    perkNotes,
    perkRanks: Object.keys(perkRanks).length > 0 ? perkRanks : undefined,
    perkStatChoices: Object.keys(perkStatChoices).length > 0
      ? perkStatChoices
      : undefined,
    perkDisguises,
    inventory,
  };

  const {
    carriedWeight,
    setCarriedWeight,
    inventoryWeight,
    carryCapacity,
    encumbranceLevel,
    encumbrancePenaltyText,
    effectiveByStat,
  } = useCharacterStats(draft);

  const inventoryPointCost = calculateInventoryPointCost(
    inventory,
    (id) => WEAPONS_BY_ID.get(id)?.pointCost ?? 0,
    {
      getEquipment: (id) => EQUIPMENT_BY_ID.get(id),
      getAttachment: (id) => ATTACHMENTS_BY_ID.get(id),
    },
  );

  const perksById = new Map(props.perks.map((perk) => [perk.id, perk]));
  const derivedPerkIds = getDerivedPerkIds(perkIds);
  const ownedPerks = perkIds.map((id) => ({ id, perk: perksById.get(id) }));
  const ownedLockCategories = new Set(
    ownedPerks
      .map((item) => item.perk?.lockCategory)
      .filter((lockCategory): lockCategory is string => Boolean(lockCategory)),
  );
  const ownedPerkGroups = PERK_CATEGORY_ORDER
    .map((category) => ({
      category,
      items: ownedPerks.filter((item) => item.perk?.category === category),
    }))
    .filter((group) => group.items.length > 0);
  const uncategorizedOwnedPerks = ownedPerks.filter((item) => !item.perk);

  const eligiblePerks = props.perks.filter((perk) => {
    if (perkIds.includes(perk.id)) return false;
    if (derivedPerkIds.has(perk.id)) return false;
    if (perk.requiredRaces && !perk.requiredRaces.includes(race)) {
      return false;
    }
    if (perk.requiredSex && !perk.requiredSex.includes(description.sex)) {
      return false;
    }
    if (perk.requiredFaction) {
      const factions = Array.isArray(perk.requiredFaction)
        ? perk.requiredFaction
        : [perk.requiredFaction];
      if (!factions.includes(description.faction as typeof factions[number])) {
        return false;
      }
    }
    if (perk.lockCategory && ownedLockCategories.has(perk.lockCategory)) {
      return false;
    }
    if (perk.excludesPerks?.some((id) => perkIds.includes(id))) {
      return false;
    }
    // Also hide perks that are excluded BY a currently-owned perk
    const isExcludedByOwned = ownedPerks.some((owned) =>
      owned.perk?.excludesPerks?.includes(perk.id)
    );
    if (isExcludedByOwned) return false;
    return true;
  });

  const availablePerks = eligiblePerks.filter((perk) => {
    if (perkCategoryFilter && perk.category !== perkCategoryFilter) {
      return false;
    }
    if (perkSearchFilter) {
      const q = perkSearchFilter.toLowerCase();
      if (!perk.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function updateDescription<K extends keyof CharacterDescription>(
    key: K,
    value: CharacterDescription[K],
  ) {
    setDescription((current) => ({ ...current, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    setImageUploading(true);
    setImageError("");

    try {
      // 1. Get a direct upload URL
      const isUpdate = props.action === "update" && props.characterId;
      const urlEndpoint = isUpdate
        ? `/api/characters/${props.characterId}/image`
        : `/api/images/direct-upload`;

      const urlRes = await fetch(urlEndpoint, { method: "POST" });
      if (!urlRes.ok) {
        throw new Error("Failed to get upload URL");
      }
      const { uploadURL, imageId } = await urlRes.json();

      // 2. Upload the file directly to Cloudflare
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch(uploadURL, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        throw new Error("Image upload to Cloudflare failed");
      }

      if (isUpdate) {
        // 3a. Update mode: save the image ID on the character immediately
        const saveRes = await fetch(
          `/api/characters/${props.characterId}/image`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageId }),
          },
        );
        if (!saveRes.ok) {
          throw new Error("Failed to save image reference");
        }
        const { imageUrl } = await saveRes.json();
        setCurrentImageUrl(imageUrl);
      } else {
        // 3b. Create mode: store the imageId to submit with the form
        setPendingImageId(imageId);
        // Show a preview via the object URL
        setCurrentImageUrl(URL.createObjectURL(file));
      }
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleImageDelete() {
    setImageUploading(true);
    setImageError("");

    try {
      if (props.action === "update" && props.characterId) {
        const res = await fetch(
          `/api/characters/${props.characterId}/image`,
          { method: "DELETE" },
        );
        if (!res.ok) {
          throw new Error("Failed to delete image");
        }
      }
      // For create mode, just clear local state (orphaned CF image will expire)
      setCurrentImageUrl("");
      setPendingImageId("");
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setImageUploading(false);
    }
  }

  // When pending approval, allow full re-allocation (no floor on decreases)
  const statFloor = props.isPending ? 0 : undefined;
  const canRemoveOldPerks = !!props.isPending;
  const lockIdentityFields = props.action === "update" && !props.isPending;

  function increaseStat(statKey: BaseStatKey) {
    if (unallocatedStatPoints - inventoryPointCost < 1) {
      return;
    }

    setBaseStats((current) => ({
      ...current,
      [statKey]: current[statKey] + 1,
    }));
    setUnallocatedStatPoints((current) => current - 1);
  }

  function decreaseStat(statKey: BaseStatKey) {
    const floor = statFloor ?? initialBaseStats[statKey];
    if (baseStats[statKey] <= floor) {
      return;
    }

    setBaseStats((current) => ({
      ...current,
      [statKey]: current[statKey] - 1,
    }));
    setUnallocatedStatPoints((current) => current + 1);
  }

  function buyPerk(perkId: string) {
    if (perkIds.includes(perkId)) return;

    const perk = perksById.get(perkId);
    const includedIds = (perk?.includesPerks ?? []).filter((id) =>
      !perkIds.includes(id)
    );
    const newPerkIds = [...perkIds, perkId, ...includedIds];
    const cost = calculatePerksCost(newPerkIds, perkRanks) -
      calculatePerksCost(perkIds, perkRanks);

    if (unallocatedStatPoints - inventoryPointCost < cost) return;

    setPerkIds(newPerkIds);
    setUnallocatedStatPoints((current) => current - cost);

    // Initialize per-rank data for upgradable perks
    if (perk?.upgradable) {
      if (perk.customInput) {
        setPerkUpgradeNotes((current) => ({ ...current, [perkId]: [""] }));
      }
      if (perk.requiresStatChoice) {
        setPerkStatChoices((current) => ({
          ...current,
          [perkId]: ["" as BaseStatKey],
        }));
      }
    }
  }

  function unbuyPerk(perkId: string) {
    if (!canRemoveOldPerks && initialPerkIds.includes(perkId)) {
      return;
    }
    if (!perkIds.includes(perkId)) {
      return;
    }
    // Prevent removing a perk that is still derived from another active perk
    if (derivedPerkIds.has(perkId)) {
      return;
    }

    // Determine which included perks should also be removed (those that are no
    // longer derived from any remaining source perk)
    const perk = perksById.get(perkId);
    const perkIdsWithoutSource = perkIds.filter((id) => id !== perkId);
    const stillDerived = getDerivedPerkIds(perkIdsWithoutSource);
    const orphanedIds = (perk?.includesPerks ?? []).filter(
      (id) => !stillDerived.has(id),
    );
    const newPerkIds = perkIdsWithoutSource.filter(
      (id) => !orphanedIds.includes(id),
    );
    const refund = calculatePerksCost(perkIds, perkRanks) -
      calculatePerksCost(newPerkIds, perkRanks);
    setPerkIds(newPerkIds);
    const allRemovedIds = [perkId, ...orphanedIds];
    setPerkNotes((current) => {
      const next = { ...current };
      for (const id of allRemovedIds) delete next[id];
      return next;
    });
    setPerkUpgradeNotes((current) => {
      const next = { ...current };
      for (const id of allRemovedIds) delete next[id];
      return next;
    });
    setPerkStatChoices((current) => {
      const next = { ...current };
      for (const id of allRemovedIds) delete next[id];
      return next;
    });
    setPerkRanks((current) => {
      const next = { ...current };
      for (const id of allRemovedIds) delete next[id];
      return next;
    });
    setPerkDisguises((current) => {
      const next = { ...current };
      for (const id of allRemovedIds) delete next[id];
      return next;
    });
    setUnallocatedStatPoints((current) => current + refund);
  }

  function upgradePerk(perkId: string) {
    const perk = perksById.get(perkId);
    if (!perk?.upgradable) return;
    const currentRank = perkRanks[perkId] ?? 1;
    if (perk.maxRanks !== undefined && currentRank >= perk.maxRanks) return;

    const newRanks = { ...perkRanks, [perkId]: currentRank + 1 };
    const upgradeCost = calculatePerksCost(perkIds, newRanks) -
      calculatePerksCost(perkIds, perkRanks);

    if (unallocatedStatPoints - inventoryPointCost < upgradeCost) return;

    setPerkRanks(newRanks);
    setUnallocatedStatPoints((current) => current - upgradeCost);

    if (perk.customInput) {
      setPerkUpgradeNotes((current) => ({
        ...current,
        [perkId]: [...(current[perkId] ?? [""]), ""],
      }));
    }
    if (perk.requiresStatChoice) {
      setPerkStatChoices((current) => ({
        ...current,
        [perkId]: [...(current[perkId] ?? ["" as BaseStatKey]), "" as BaseStatKey],
      }));
    }
  }

  function downgradePerk(perkId: string) {
    const perk = perksById.get(perkId);
    if (!perk?.upgradable) return;
    const currentRank = perkRanks[perkId] ?? 1;

    if (currentRank <= 1) {
      // Don't allow removing a perk that is derived from another active perk
      if (derivedPerkIds.has(perkId)) return;
      unbuyPerk(perkId);
      return;
    }

    const newRanks = { ...perkRanks, [perkId]: currentRank - 1 };
    const refund = calculatePerksCost(perkIds, perkRanks) -
      calculatePerksCost(perkIds, newRanks);

    setPerkRanks(newRanks);
    setUnallocatedStatPoints((current) => current + refund);

    if (perk.customInput) {
      setPerkUpgradeNotes((current) => {
        const notes = [...(current[perkId] ?? [])];
        notes.pop();
        return { ...current, [perkId]: notes };
      });
    }
    if (perk.requiresStatChoice) {
      setPerkStatChoices((current) => {
        const choices = [...(current[perkId] ?? [])];
        choices.pop();
        return { ...current, [perkId]: choices };
      });
    }
  }

  return (
    <form method="POST" class="space-y-4 border rounded-lg p-4 bg-base-100/80">
      <h2 class="text-xl font-semibold">{props.title}</h2>
      <input type="hidden" name="action" value={props.action} />
      {props.action === "update" && props.characterId && (
        <input type="hidden" name="id" value={props.characterId} />
      )}
      {props.basedOnSnapshotId && (
        <input
          type="hidden"
          name="basedOnSnapshotId"
          value={props.basedOnSnapshotId}
        />
      )}
      <input type="hidden" name="baseStats" value={JSON.stringify(baseStats)} />
      <input
        type="hidden"
        name="description"
        value={JSON.stringify(description)}
      />
      <input type="hidden" name="perkIds" value={JSON.stringify(perkIds)} />
      <input
        type="hidden"
        name="perkNotes"
        value={JSON.stringify(perkNotes)}
      />
      <input
        type="hidden"
        name="perkUpgradeNotes"
        value={JSON.stringify(perkUpgradeNotes)}
      />
      <input
        type="hidden"
        name="perkStatChoices"
        value={JSON.stringify(perkStatChoices)}
      />
      <input
        type="hidden"
        name="perkRanks"
        value={JSON.stringify(perkRanks)}
      />
      <input
        type="hidden"
        name="perkDisguises"
        value={JSON.stringify(perkDisguises)}
      />
      <input type="hidden" name="pendingImageId" value={pendingImageId} />
      <input
        type="hidden"
        name="inventory"
        value={JSON.stringify(inventory)}
      />
      <input
        type="hidden"
        name="unallocatedStatPoints"
        value={String(unallocatedStatPoints)}
      />
      {/* When identity fields are locked the fieldset is disabled and its
          inputs are excluded from form submission, so emit a hidden input. */}
      {lockIdentityFields && (
        <input type="hidden" name="name" value={name} />
      )}

      {lockIdentityFields && (
        <p class="text-sm text-base-content/70">
          Name and description are locked after approval. An admin must
          disapprove the character to change them.
        </p>
      )}

      <fieldset
        disabled={lockIdentityFields}
        class="space-y-4 disabled:opacity-70"
      >
        <label class="block">
          <span class="block font-medium mb-1">Name</span>
          <input
            class="w-full border rounded px-3 py-2"
            name="name"
            type="text"
            value={name}
            onInput={(event) =>
              setName(event.currentTarget.value)}
            required
          />
        </label>

        <div class="rounded border p-3 space-y-3">
          <button
            type="button"
            class="font-semibold text-primary hover:underline cursor-pointer"
            onClick={() =>
              setShowDescription((v) => !v)}
          >
            Description {showDescription ? "▲" : "▼"}
          </button>
          {showDescription && (
            <>
              <label class="block">
                <span class="block font-medium mb-1">Race</span>
                <select
                  class="w-full border rounded px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  name="race"
                  value={race}
                  disabled={lockIdentityFields}
                  onInput={(event) => {
                    const newRace = event.currentTarget
                      .value as CharacterDraft["race"];
                    const pointsDiff = getStartingStatPoints(newRace) -
                      getStartingStatPoints(race);
                    // Remove perks that require the old race but not the new one
                    const keptPerkIds = perkIds.filter((id) => {
                      const perk = PERKS_BY_ID.get(id);
                      if (
                        perk?.requiredRaces &&
                        !perk.requiredRaces.includes(newRace)
                      ) return false;
                      return true;
                    });
                    const keptRanks = Object.fromEntries(
                      Object.entries(perkRanks).filter(([id]) =>
                        keptPerkIds.includes(id)
                      ),
                    );
                    const perkRefund = calculatePerksCost(perkIds, perkRanks) -
                      calculatePerksCost(keptPerkIds, keptRanks);
                    if (keptPerkIds.length !== perkIds.length) {
                      const removedIds = perkIds.filter((id) =>
                        !keptPerkIds.includes(id)
                      );
                      setPerkNotes((current) => {
                        const next = { ...current };
                        for (const id of removedIds) delete next[id];
                        return next;
                      });
                      setPerkUpgradeNotes((current) => {
                        const next = { ...current };
                        for (const id of removedIds) delete next[id];
                        return next;
                      });
                      setPerkStatChoices((current) => {
                        const next = { ...current };
                        for (const id of removedIds) delete next[id];
                        return next;
                      });
                      setPerkRanks(keptRanks);
                      setPerkIds(keptPerkIds);
                    }
                    setRace(newRace);
                    setUnallocatedStatPoints((current) =>
                      current + pointsDiff + perkRefund
                    );
                  }}
                >
                  {getRacesForSex(description.sex).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Sex</span>
                <select
                  class="w-full border rounded px-3 py-2"
                  value={description.sex}
                  onInput={(event) => {
                    const newSex = event.currentTarget.value as Sex;
                    updateDescription("sex", newSex);
                    // Swap gendered race name to match new sex
                    setRace((prev) =>
                      mapRaceForSex(prev, newSex)
                    );
                  }}
                >
                  {SEX_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              {isPilzRace(race) && (
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={description.isTemplate}
                    disabled={lockIdentityFields}
                    onChange={(event) =>
                      updateDescription(
                        "isTemplate",
                        event.currentTarget.checked,
                      )}
                    class={lockIdentityFields
                      ? "opacity-60 cursor-not-allowed"
                      : ""}
                  />
                  <span class="font-medium">Is a template</span>
                </label>
              )}

              <label class="block">
                <span class="block font-medium mb-1">Country of Origin</span>
                <input
                  class="w-full border rounded px-3 py-2"
                  type="text"
                  value={description.countryOfOrigin}
                  onInput={(event) =>
                    updateDescription(
                      "countryOfOrigin",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Faction</span>
                <select
                  class="w-full border rounded px-3 py-2"
                  value={description.faction}
                  onChange={(event) =>
                    updateDescription(
                      "faction",
                      (event.target as HTMLSelectElement).value,
                    )}
                >
                  <option value="">— None —</option>
                  {FACTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Role</span>
                <input
                  class="w-full border rounded px-3 py-2"
                  type="text"
                  placeholder="Cook, politician, soldier, sapper, conscript, etc."
                  value={description.role}
                  onInput={(event) =>
                    updateDescription("role", event.currentTarget.value)}
                />
              </label>

              {description.role.toLowerCase() === "soldier" && (
                <label class="block">
                  <span class="block font-medium mb-1">Subfaction</span>
                  <input
                    class="w-full border rounded px-3 py-2"
                    type="text"
                    value={description.subfaction}
                    onInput={(event) =>
                      updateDescription(
                        "subfaction",
                        event.currentTarget.value,
                      )}
                  />
                </label>
              )}

              <label class="block">
                <span class="block font-medium mb-1">Age</span>
                <input
                  class="w-full border rounded px-3 py-2"
                  type="text"
                  placeholder={isPilzRace(race)
                    ? "Biological age is 21 by default. Include chronological age."
                    : "Must be 18+. Include chronological age (year 1923)."}
                  value={description.age}
                  onInput={(event) =>
                    updateDescription("age", event.currentTarget.value)}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Date of Birth</span>
                <input
                  class="w-full border rounded px-3 py-2"
                  type="text"
                  placeholder="M/D/Y — Year is mandatory, month and day are optional"
                  value={description.dateOfBirth}
                  onInput={(event) =>
                    updateDescription("dateOfBirth", event.currentTarget.value)}
                />
              </label>

              <div class="grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="block font-medium mb-1">Height</span>
                  <input
                    class="w-full border rounded px-3 py-2"
                    type="text"
                    value={description.height}
                    onInput={(event) =>
                      updateDescription("height", event.currentTarget.value)}
                  />
                </label>

                <label class="block">
                  <span class="block font-medium mb-1">Weight</span>
                  <input
                    class="w-full border rounded px-3 py-2"
                    type="text"
                    value={description.weight}
                    onInput={(event) =>
                      updateDescription("weight", event.currentTarget.value)}
                  />
                </label>
              </div>

              <p class="text-sm text-base-content/60 italic">
                The appearance fields below may be left blank if using an image
                to represent your character.
              </p>

              <div class="rounded border p-3 space-y-2 bg-base-200">
                <h4 class="font-medium">Character Image</h4>
                {currentImageUrl && (
                  <div class="space-y-2">
                    <img
                      src={currentImageUrl}
                      alt={`${name} character image`}
                      class="max-w-xs rounded border"
                    />
                    <button
                      type="button"
                      class="px-2 py-1 text-sm border rounded text-error hover:bg-error/10"
                      disabled={imageUploading}
                      onClick={handleImageDelete}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <label class="block">
                  <span class="block text-sm mb-1">
                    {currentImageUrl ? "Replace image:" : "Upload an image:"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    class="block text-sm"
                    disabled={imageUploading}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
                {imageUploading && (
                  <p class="text-sm text-primary">Uploading…</p>
                )}
                {imageError && <p class="text-sm text-error">{imageError}</p>}
              </div>

              <div class="grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="block font-medium mb-1">Skin Color</span>
                  <input
                    class="w-full border rounded px-3 py-2"
                    type="text"
                    value={description.skinColor}
                    onInput={(event) =>
                      updateDescription("skinColor", event.currentTarget.value)}
                  />
                </label>

                <label class="block">
                  <span class="block font-medium mb-1">Hair Color</span>
                  <input
                    class="w-full border rounded px-3 py-2"
                    type="text"
                    value={description.hairColor}
                    onInput={(event) =>
                      updateDescription("hairColor", event.currentTarget.value)}
                  />
                </label>

                <label class="block">
                  <span class="block font-medium mb-1">Eye Color</span>
                  <input
                    class="w-full border rounded px-3 py-2"
                    type="text"
                    value={description.eyeColor}
                    onInput={(event) =>
                      updateDescription("eyeColor", event.currentTarget.value)}
                  />
                </label>

                <label class="block">
                  <span class="block font-medium mb-1">Ethnicity</span>
                  <input
                    class="w-full border rounded px-3 py-2"
                    type="text"
                    value={description.ethnicity}
                    onInput={(event) =>
                      updateDescription("ethnicity", event.currentTarget.value)}
                  />
                </label>
              </div>

              <label class="block">
                <span class="block font-medium mb-1">Body Type</span>
                <input
                  class="w-full border rounded px-3 py-2"
                  type="text"
                  value={description.bodyType}
                  onInput={(event) =>
                    updateDescription("bodyType", event.currentTarget.value)}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">General Appearance</span>
                <textarea
                  class="w-full border rounded px-3 py-2"
                  rows={3}
                  value={description.generalAppearance}
                  onInput={(event) =>
                    updateDescription(
                      "generalAppearance",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">General Health</span>
                <textarea
                  class="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Permanent factors: scars, missing limbs, mental conditions, etc."
                  value={description.generalHealth}
                  onInput={(event) =>
                    updateDescription(
                      "generalHealth",
                      event.currentTarget.value,
                    )}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Personality</span>
                <textarea
                  class="w-full border rounded px-3 py-2"
                  rows={3}
                  value={description.personality}
                  onInput={(event) =>
                    updateDescription("personality", event.currentTarget.value)}
                />
              </label>

              <label class="block">
                <span class="block font-medium mb-1">Biography</span>
                <textarea
                  class="w-full border rounded px-3 py-2"
                  rows={5}
                  value={description.biography}
                  onInput={(event) =>
                    updateDescription("biography", event.currentTarget.value)}
                />
              </label>
            </>
          )}
        </div>
      </fieldset>

      {props.action === "update" && !props.isPending && (
        <label class="block">
          <span class="block font-medium mb-1">Changelog</span>
          <input
            class="w-full border rounded px-3 py-2"
            name="changelog"
            type="text"
            value={changelog}
            onInput={(event) => setChangelog(event.currentTarget.value)}
            placeholder="Describe what changed in this save"
            required
          />
        </label>
      )}

      <div class="rounded border p-3 space-y-2">
        <h3 class="font-semibold">Base Stats</h3>
        <p class="text-sm text-base-content flex items-center gap-2">
          Unallocated stat points:{" "}
          <strong>{unallocatedStatPoints - inventoryPointCost}</strong>
          <button
            type="button"
            class="px-2 py-1 border rounded disabled:opacity-40"
            disabled={unallocatedStatPoints - inventoryPointCost < 1}
            onClick={() => setUnallocatedStatPoints((c) => c - 1)}
          >
            -1
          </button>
          <button
            type="button"
            class="px-2 py-1 border rounded"
            onClick={() => setUnallocatedStatPoints((c) => c + 1)}
          >
            +1
          </button>
        </p>
        <ul class="space-y-2">
          {BASE_STAT_FIELDS.filter((field) =>
            race !== "Baseliner" || field.key !== "digestionStrength"
          ).map((field) => (
            <li class="flex items-center justify-between gap-2" key={field.key}>
              <span class="text-sm">{field.label}</span>
              <span class="text-sm">
                Base: <strong>{baseStats[field.key]}</strong> | Effective:{" "}
                <strong>{effectiveByStat[field.key]}</strong>
              </span>
              <div class="flex gap-1">
                <button
                  type="button"
                  class="px-2 py-1 border rounded disabled:opacity-40"
                  disabled={baseStats[field.key] <=
                    (statFloor ?? initialBaseStats[field.key])}
                  onClick={() =>
                    decreaseStat(field.key)}
                >
                  -1
                </button>
                <button
                  type="button"
                  class="px-2 py-1 border rounded disabled:opacity-40"
                  disabled={unallocatedStatPoints - inventoryPointCost < 1}
                  onClick={() =>
                    increaseStat(field.key)}
                >
                  +1
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <OtherStatsSection draft={draft} carryCapacity={carryCapacity} />

      <EncumbranceSection
        carriedWeight={carriedWeight}
        onCarriedWeightChange={setCarriedWeight}
        encumbranceLevel={encumbranceLevel}
        encumbrancePenaltyText={encumbrancePenaltyText}
        inventoryWeight={inventoryWeight}
      />

      <div class="rounded border p-3 space-y-3">
        <h3 class="font-semibold">Perks</h3>
        <p class="text-sm text-base-content">
          Perks cost {PERK_COST_STAT_POINTS} stat points each. {(() => {
            const paidPerkInstances = perkIds
              .filter((id) => !PERKS_BY_ID.get(id)?.isFree)
              .reduce((sum, id) => sum + (perkRanks[id] ?? 1), 0);
            return paidPerkInstances === 0
              ? <strong>First perk is free!</strong>
              : null;
          })()}
        </p>

        <div>
          <h4 class="font-medium">Owned Perks</h4>
          {perkIds.length === 0
            ? <p class="text-sm text-base-content">No perks unlocked.</p>
            : (
              <div class="space-y-3 text-sm">
                {ownedPerkGroups.map((group) => (
                  <div key={group.category} class="space-y-1">
                    <h5 class="font-medium">
                      {PERK_CATEGORY_LABELS[group.category]}
                    </h5>
                    <ul class="space-y-2">
                      {group.items.map(({ id, perk }) => {
                        const isDerived = derivedPerkIds.has(id);
                        const sourcePerk = isDerived
                          ? ownedPerks.find((op) =>
                            op.perk?.includesPerks?.includes(id)
                          )?.perk
                          : undefined;
                        const canRemove = !isDerived && (canRemoveOldPerks ||
                          !initialPerkIds.includes(id));
                        const currentRank = perkRanks[id] ?? 1;
                        const isUpgradable = perk?.upgradable ?? false;
                        const initialRank = initialPerkRanks[id] ??
                          (initialPerkIds.includes(id) ? 1 : 0);
                        const canDowngrade = isUpgradable &&
                          (canRemoveOldPerks || currentRank > initialRank) &&
                          // Derived perks cannot be downgraded below rank 1
                          (!isDerived || currentRank > 1);
                        const chosenStats = (perkStatChoices[id] ?? []) as BaseStatKey[];
                        const hasUnsatisfiedStatChoices =
                          perk?.requiresStatChoice
                            ? chosenStats.length < currentRank ||
                              chosenStats.some((s) => !s)
                            : false;
                        const hasRemainingStats = !perk?.requiresStatChoice ||
                          (perk.requiresStatChoice ?? []).some(
                            (s) => !chosenStats.includes(s as BaseStatKey),
                          );
                        const canUpgrade = isUpgradable &&
                          (perk?.maxRanks === undefined ||
                            currentRank < perk.maxRanks) &&
                          !hasUnsatisfiedStatChoices &&
                          hasRemainingStats;
                        const upgradeRanks = {
                          ...perkRanks,
                          [id]: currentRank + 1,
                        };
                        const upgradeCost = canUpgrade
                          ? calculatePerksCost(perkIds, upgradeRanks) -
                            calculatePerksCost(perkIds, perkRanks)
                          : 0;
                        const canAffordUpgrade =
                          (unallocatedStatPoints - inventoryPointCost) >=
                          upgradeCost;
                        const statLabelMap = BASE_STAT_FIELDS.reduce(
                          (m, f) => { m[f.key] = f.label; return m; },
                          {} as Record<string, string>,
                        );
                        return (
                          <li key={id}>
                            <div class="flex items-center gap-2 flex-wrap">
                              <span>
                                {perk
                                  ? (
                                    <PerkDescription
                                      name={perk.name}
                                      description={perk.description}
                                    />
                                  )
                                  : id}
                                {isDerived && sourcePerk && (
                                  <span class="ml-1 text-xs bg-base-300 text-base-content/60 px-1 rounded">
                                    included by {sourcePerk.name}
                                  </span>
                                )}
                                {isUpgradable && currentRank > 1 && (
                                  <span class="ml-1 text-xs bg-primary/20 text-primary px-1 rounded">
                                    Rank {currentRank}
                                  </span>
                                )}
                              </span>
                              {isUpgradable && canUpgrade && canAffordUpgrade && (
                                <button
                                  type="button"
                                  class="px-2 py-0.5 text-xs border rounded text-primary hover:bg-primary/10"
                                  onClick={() => upgradePerk(id)}
                                >
                                  Upgrade{upgradeCost < 0
                                    ? ` (+${-upgradeCost} SP)`
                                    : upgradeCost === 0
                                    ? " (Free)"
                                    : ` (${upgradeCost} SP)`}
                                </button>
                              )}
                              {canDowngrade && (
                                <button
                                  type="button"
                                  class="px-2 py-0.5 text-xs border rounded text-warning hover:bg-warning/10"
                                  onClick={() => downgradePerk(id)}
                                >
                                  {currentRank > 1 ? "Downgrade" : "Remove"}
                                </button>
                              )}
                              {canRemove && (
                                <button
                                  type="button"
                                  class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
                                  onClick={() => unbuyPerk(id)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            {/* Upgradable perk: per-rank inputs */}
                            {isUpgradable &&
                              (perk?.requiresStatChoice || perk?.customInput) && (
                              <div class="mt-1 space-y-1">
                                {Array.from({ length: currentRank }, (_, ri) => {
                                  const chosenForRank = chosenStats[ri];
                                  const usedByOthers = chosenStats.filter(
                                    (_, i) => i !== ri,
                                  );
                                  return (
                                    <div
                                      key={ri}
                                      class="border rounded px-2 py-1 text-xs space-y-1"
                                    >
                                      <span class="font-semibold text-xs">
                                        Rank {ri + 1}
                                      </span>
                                      {perk?.requiresStatChoice && (
                                        <div>
                                          <label class="text-xs text-base-content/70 mr-1">
                                            Locked stat:
                                          </label>
                                          <select
                                            class="border rounded px-1 py-0.5 text-xs"
                                            value={chosenForRank ?? ""}
                                            onChange={(e) => {
                                              const val =
                                                (e.target as HTMLSelectElement)
                                                  .value as BaseStatKey;
                                              setPerkStatChoices((current) => {
                                                const choices = [
                                                  ...(current[id] ??
                                                    Array(currentRank).fill(
                                                      "" as BaseStatKey,
                                                    )),
                                                ];
                                                choices[ri] = val;
                                                return {
                                                  ...current,
                                                  [id]: choices,
                                                };
                                              });
                                            }}
                                          >
                                            <option value="">
                                              — Select stat —
                                            </option>
                                            {(perk.requiresStatChoice ?? [])
                                              .filter(
                                                (s) =>
                                                  !usedByOthers.includes(
                                                    s as BaseStatKey,
                                                  ) ||
                                                  s === chosenForRank,
                                              )
                                              .map((s) => (
                                                <option key={s} value={s}>
                                                  {statLabelMap[s] ?? s}
                                                </option>
                                              ))}
                                          </select>
                                        </div>
                                      )}
                                      {perk?.customInput && (
                                        <input
                                          type="text"
                                          class="w-full border rounded px-2 py-1 text-xs"
                                          placeholder={perk.customInput}
                                          value={(perkUpgradeNotes[id] ??
                                            [])[ri] ?? ""}
                                          onInput={(e) => {
                                            const value =
                                              (e.target as HTMLInputElement)
                                                .value;
                                            setPerkUpgradeNotes((current) => {
                                              const notes = [
                                                ...(current[id] ??
                                                  Array(currentRank).fill("")),
                                              ];
                                              notes[ri] = value;
                                              return {
                                                ...current,
                                                [id]: notes,
                                              };
                                            });
                                          }}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {/* Non-upgradable perk: single note input */}
                            {!isUpgradable && perk?.customInput && (
                              <input
                                type="text"
                                class="mt-1 w-full border rounded px-2 py-1 text-sm"
                                placeholder={perk.customInput}
                                value={perkNotes[id] ?? ""}
                                onInput={(e) => {
                                  const value =
                                    (e.target as HTMLInputElement).value;
                                  setPerkNotes((current) => ({
                                    ...current,
                                    [id]: value,
                                  }));
                                }}
                              />
                            )}
                            {perk?.canDisguise && (
                              <div class="mt-1">
                                <label class="text-xs text-base-content/70">
                                  Disguise as:
                                </label>
                                <select
                                  class="ml-2 border rounded px-2 py-1 text-sm"
                                  value={perkDisguises[id] ?? ""}
                                  onChange={(e) => {
                                    const value =
                                      (e.target as HTMLSelectElement).value;
                                    setPerkDisguises((current) => {
                                      if (!value) {
                                        const next = { ...current };
                                        delete next[id];
                                        return next;
                                      }
                                      return { ...current, [id]: value };
                                    });
                                  }}
                                >
                                  <option value="">
                                    (no disguise)
                                  </option>
                                  {props.perks
                                    .filter((p) =>
                                      p.id !== id &&
                                      !p.canDisguise &&
                                      !p.isFree
                                    )
                                    .map((p) => (
                                      <option key={p.id} value={p.id}>
                                        {p.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {uncategorizedOwnedPerks.length > 0 && (
                  <div class="space-y-1">
                    <h5 class="font-medium">Other</h5>
                    <ul class="space-y-1">
                      {uncategorizedOwnedPerks.map(({ id }) => {
                        const canRemove = canRemoveOldPerks ||
                          !initialPerkIds.includes(id);
                        return (
                          <li class="flex items-center gap-2" key={id}>
                            <span>{id}</span>
                            {canRemove && (
                              <button
                                type="button"
                                class="px-2 py-0.5 text-xs border rounded text-error hover:bg-error/10"
                                onClick={() => unbuyPerk(id)}
                              >
                                Remove
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>

        {eligiblePerks.length > 0 && (
          <div class="space-y-2">
            <button
              type="button"
              class="px-2 py-1 border rounded"
              onClick={() => setShowPerkPicker((current) => !current)}
            >
              {showPerkPicker ? "Cancel" : "Add Perk"}
            </button>
            {showPerkPicker && (
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <select
                    class="border rounded px-2 py-1 text-sm"
                    value={perkCategoryFilter}
                    onChange={(e) =>
                      setPerkCategoryFilter(
                        (e.target as HTMLSelectElement).value as
                          | PerkCategory
                          | "",
                      )}
                  >
                    <option value="">All categories</option>
                    <option value="combat">Combat</option>
                    <option value="vore">Vore</option>
                    <option value="smut">Smut</option>
                    <option value="gimmick">Gimmick</option>
                    <option value="pf-type">PF Type</option>
                    <option value="faction">Faction</option>
                    <option value="negative">Negative</option>
                  </select>
                  <input
                    type="text"
                    class="border rounded px-2 py-1 text-sm flex-1 min-w-[140px]"
                    placeholder="Search perks by name…"
                    value={perkSearchFilter}
                    onInput={(e) =>
                      setPerkSearchFilter(
                        (e.target as HTMLInputElement).value,
                      )}
                  />
                </div>
                {availablePerks.length === 0
                  ? (
                    <p class="text-sm text-base-content/60 italic">
                      No matching perks found.
                    </p>
                  )
                  : (
                    <ul class="space-y-2">
                      {availablePerks.map((perk) => {
                        const cost = calculatePerksCost([...perkIds, perk.id], perkRanks) -
                          calculatePerksCost(perkIds, perkRanks);
                        const canAfford =
                          (unallocatedStatPoints - inventoryPointCost) >= cost;
                        const costLabel = cost < 0
                          ? `Unlock (+${-cost} SP)`
                          : cost === 0
                          ? "Unlock (Free)"
                          : `Buy (${cost} SP)`;
                        return (
                          <li
                            class="flex items-center justify-between gap-2"
                            key={perk.id}
                          >
                            <span class="text-sm">
                              <PerkDescription
                                name={perk.name}
                                description={perk.description}
                              />
                            </span>
                            <button
                              type="button"
                              class="px-2 py-1 border rounded disabled:opacity-40"
                              disabled={!canAfford}
                              onClick={() => buyPerk(perk.id)}
                            >
                              {costLabel}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      <InventorySection
        inventory={inventory}
        onChange={setInventory}
        availablePoints={unallocatedStatPoints}
        perkIds={perkIds}
      />

      <button
        type="submit"
        class="px-3 py-2 border rounded bg-base-200 hover:bg-base-300 transition-colors"
      >
        {props.submitLabel}
      </button>
    </form>
  );
}
