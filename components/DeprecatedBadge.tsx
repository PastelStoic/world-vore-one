/** Visual marker for catalog entries kept for existing sheets but no longer available new. */
export default function DeprecatedBadge() {
  return (
    <span
      class="ml-1 text-xs font-semibold text-warning"
      title="Deprecated — kept for existing character sheets; cannot be newly selected"
    >
      [Deprecated]
    </span>
  );
}
