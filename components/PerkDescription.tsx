import { useState } from "preact/hooks";

interface PerkDescriptionProps {
  name: string;
  description: string;
}

export default function PerkDescription(
  { name, description }: PerkDescriptionProps,
) {
  const [showDetails, setShowDetails] = useState(false);

  const lines = description.split("\n");
  const brief = lines[0];
  const details = lines.slice(1).join("\n").trim();
  const hasDetails = details.length > 0;

  return (
    <span>
      <strong>{name}</strong>: {brief}
      {hasDetails && (
        <>
          {" "}
          <button
            type="button"
            class="text-xs text-blue-600 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails((v) => !v);
            }}
          >
            {showDetails ? "hide details" : "see details"}
          </button>
          {showDetails && (
            <span class="block whitespace-pre-line text-gray-700 ml-2 mt-1">
              {details}
            </span>
          )}
        </>
      )}
    </span>
  );
}
