// ---------------------------------------------------------------------------
// AttachmentCard – renders a loose (unattached) attachment in the inventory
// ---------------------------------------------------------------------------

import type { InventoryAttachment } from "@/lib/inventory_types.ts";
import { ATTACHMENTS_BY_ID } from "@/data/equipment.ts";
import { PERKS_BY_ID } from "@/data/perks.ts";
import PerkDescription from "@/components/PerkDescription.tsx";
import DeprecatedBadge from "@/components/DeprecatedBadge.tsx";
import type { InventoryLocation } from "./helpers.ts";
import UnknownInventoryItem from "./UnknownInventoryItem.tsx";
import InventoryItemActions from "./InventoryItemActions.tsx";
import ChargeTracker from "./ChargeTracker.tsx";

interface AttachmentCardProps {
  attachment: InventoryAttachment;
  location: InventoryLocation;
  index: number;
  readOnly?: boolean;
  onMove: (
    from: InventoryLocation,
    index: number,
    to: InventoryLocation,
  ) => void;
  onRemove: (location: InventoryLocation, index: number) => void;
  onSetTotalCharges: (
    location: InventoryLocation,
    index: number,
    total: number,
  ) => void;
  onToggleCharge: (
    location: InventoryLocation,
    index: number,
    chargeIndex: number,
  ) => void;
}

export default function AttachmentCard(props: AttachmentCardProps) {
  const {
    attachment: att,
    location,
    index,
    readOnly,
    onMove,
    onRemove,
    onSetTotalCharges,
    onToggleCharge,
  } = props;

  const def = ATTACHMENTS_BY_ID.get(att.attachmentId);
  if (!def) {
    return (
      <UnknownInventoryItem
        kind="attachment"
        id={att.attachmentId}
        readOnly={readOnly}
        onRemove={() => onRemove(location, index)}
      />
    );
  }

  const remaining = def.isCharge
    ? Math.max(0, att.totalCharges - att.usedCharges)
    : 0;
  const currentWeight = def.isCharge ? def.weight * remaining : def.weight;
  const isPerkGranted = !!att.perkGranted;
  const grantingPerkName = isPerkGranted
    ? PERKS_BY_ID.get(att.perkGranted!)?.name ?? att.perkGranted
    : null;

  return (
    <div class="border rounded p-2 space-y-1 bg-base-100">
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div>
          <strong>{def.name}</strong>
          {def.deprecated && <DeprecatedBadge />}{" "}
          <span class="text-xs text-base-content/60">
            (W:{currentWeight} · For: {def.appliesTo})
          </span>
          {isPerkGranted && (
            <span class="ml-1 text-xs font-semibold text-primary">
              [{grantingPerkName}]
            </span>
          )}
        </div>
        {!readOnly && (
          <InventoryItemActions
            location={location}
            deprecated={def.deprecated}
            canMove
            onMove={(to) => onMove(location, index, to)}
            onRemove={!isPerkGranted || def.deprecated
              ? () => onRemove(location, index)
              : undefined}
          />
        )}
      </div>

      <div class="text-xs text-base-content/70 whitespace-pre-line ml-2">
        <PerkDescription
          name=""
          description={def.description}
          hideByDefault
        />
      </div>

      {/* Charge tracking for charge-based attachments */}
      {def.isCharge && (
        <ChargeTracker
          totalCharges={att.totalCharges}
          usedCharges={att.usedCharges}
          currentWeight={currentWeight}
          readOnly={readOnly}
          onSetTotalCharges={(total) =>
            onSetTotalCharges(location, index, total)}
          onToggleCharge={(ci) => onToggleCharge(location, index, ci)}
        />
      )}
    </div>
  );
}
