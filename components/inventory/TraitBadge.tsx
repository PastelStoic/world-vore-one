interface TraitBadgeProps {
  name: string;
  description: string;
}

export default function TraitBadge({ name, description }: TraitBadgeProps) {
  return (
    <div class="rounded border border-base-300 bg-base-200/60 px-2 py-1 text-xs leading-relaxed">
      <span class="font-medium text-base-content">{name}</span>
      {description && (
        <span class="ml-1 whitespace-pre-line text-base-content/80">
          {description}
        </span>
      )}
    </div>
  );
}
