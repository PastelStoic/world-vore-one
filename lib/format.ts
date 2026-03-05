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
