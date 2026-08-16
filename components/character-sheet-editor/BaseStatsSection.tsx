import {
  BASE_STAT_FIELDS,
  type BaseStatKey,
  type BaseStats,
  type Race,
} from "@/lib/character_types.ts";

interface BaseStatsSectionProps {
  race: Race;
  perkIds: string[];
  baseStats: BaseStats;
  effectiveByStat: Record<string, number>;
  unallocatedStatPoints: number;
  inventoryPointCost: number;
  statCaps: Partial<Record<BaseStatKey, number>>;
  getStatFloor: (statKey: BaseStatKey) => number;
  onIncreaseStat: (statKey: BaseStatKey) => void;
  onDecreaseStat: (statKey: BaseStatKey) => void;
  onAdjustUnallocated: (delta: number) => void;
}

export function BaseStatsSection(props: BaseStatsSectionProps) {
  const availablePoints = props.unallocatedStatPoints -
    props.inventoryPointCost;

  const addictionAffectedStats = new Set<BaseStatKey>();
  if (props.perkIds.includes("crippling-addiction")) {
    const mainStats: BaseStatKey[] = [
      "strength",
      "dexterity",
      "constitution",
      "intelligence",
      "charisma",
    ];
    const maxValue = Math.max(...mainStats.map((k) => props.baseStats[k]));
    for (const k of mainStats) {
      if (props.baseStats[k] === maxValue) addictionAffectedStats.add(k);
    }
  }

  return (
    <div class="rounded border p-3 space-y-2">
      <h3 class="font-semibold">Base Stats</h3>
      <p class="text-sm text-base-content flex items-center gap-2">
        Unallocated stat points: <strong>{availablePoints}</strong>
        <button
          type="button"
          class="px-2 py-1 border rounded disabled:opacity-40"
          disabled={availablePoints < 1}
          onClick={() => props.onAdjustUnallocated(-1)}
        >
          -1
        </button>
        <button
          type="button"
          class="px-2 py-1 border rounded"
          onClick={() => props.onAdjustUnallocated(1)}
        >
          +1
        </button>
      </p>
      <ul class="space-y-2">
        {BASE_STAT_FIELDS.filter((field) =>
          props.race !== "Baseliner" || field.key !== "digestionStrength"
        ).map((field) => (
          <li
            class="flex items-center justify-between gap-2"
            key={field.key}
          >
            <span class="text-sm">
              {field.label}
              {addictionAffectedStats.has(field.key) && (
                <span class="ml-1 text-xs font-semibold text-error">
                  [Addiction]
                </span>
              )}
              {props.statCaps[field.key] !== undefined && (
                <span class="ml-1 text-xs font-semibold text-warning">
                  [Capped to {props.statCaps[field.key]}]
                </span>
              )}
            </span>
            <span class="text-sm">
              Base: <strong>{props.baseStats[field.key]}</strong> | Effective:
              {" "}
              <strong>{props.effectiveByStat[field.key]}</strong>
            </span>
            <div class="flex gap-1">
              <button
                type="button"
                class="px-2 py-1 border rounded disabled:opacity-40"
                disabled={props.baseStats[field.key] <=
                  props.getStatFloor(field.key)}
                onClick={() => props.onDecreaseStat(field.key)}
              >
                -1
              </button>
              <button
                type="button"
                class="px-2 py-1 border rounded disabled:opacity-40"
                disabled={availablePoints < 1 ||
                  (props.statCaps[field.key] !== undefined &&
                    props.baseStats[field.key] >= props.statCaps[field.key]!)}
                onClick={() => props.onIncreaseStat(field.key)}
              >
                +1
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
