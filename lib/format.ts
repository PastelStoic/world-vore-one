/** Format a catalog point cost for wiki and pickers. */
export function pointCostLabel(cost: number, freeLabel = "Free"): string {
  if (cost === 0) return freeLabel;
  if (cost === 3) return "Restricted (3 pts)";
  return `+${cost} pt`;
}

/** Format a date/timestamp for display: "Jan 1, 2025, 12:00 AM" */
export function formatDate(date: string | number | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
