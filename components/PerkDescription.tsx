import { useState } from "preact/hooks";

interface PerkDescriptionProps {
  name: string;
  description: string;
  /** When true, the entire description is hidden behind a toggle (no preview) */
  hideByDefault?: boolean;
}

export default function PerkDescription(
  { name, description, hideByDefault }: PerkDescriptionProps,
) {
  const [showDetails, setShowDetails] = useState(false);

  const lines = description.split("\n");
  const brief = lines[0];
  const details = lines.slice(1).join("\n").trim();
  const hasDetails = details.length > 0;

  if (hideByDefault) {
    return (
      <span>
        {name && <strong>{name}</strong>}
        {" "}
        <button
          type="button"
          class="text-xs text-primary hover:underline cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails((v) => !v);
          }}
        >
          {showDetails ? "hide details" : "see details"}
        </button>
        {showDetails && (
          <span class="block whitespace-pre-line text-base-content ml-2 mt-1">
            {description}
          </span>
        )}
      </span>
    );
  }

  return (
    <span>
      {name ? <><strong>{name}</strong>: </> : null}{brief}
      {hasDetails && (
        <>
          {" "}
          <button
            type="button"
            class="text-xs text-primary hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails((v) => !v);
            }}
          >
            {showDetails ? "hide details" : "see details"}
          </button>
          {showDetails && (
            <span class="block whitespace-pre-line text-base-content ml-2 mt-1">
              {details}
            </span>
          )}
        </>
      )}
    </span>
  );
}
