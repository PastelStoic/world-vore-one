import type { RefObject } from "preact";

interface CharacterImageUploadProps {
  characterName: string;
  currentImageUrl: string;
  imageUploading: boolean;
  imageError: string;
  fileInputRef: RefObject<HTMLInputElement>;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

export function CharacterImageUpload(props: CharacterImageUploadProps) {
  return (
    <div class="rounded border p-3 space-y-2 bg-base-200">
      <h4 class="font-medium">Character Image</h4>
      {props.currentImageUrl && (
        <div class="space-y-2">
          <img
            src={props.currentImageUrl}
            alt={`${props.characterName} character image`}
            class="max-w-xs rounded border"
          />
          <button
            type="button"
            class="px-2 py-1 text-sm border rounded text-error hover:bg-error/10"
            disabled={props.imageUploading}
            onClick={props.onDelete}
          >
            Remove Image
          </button>
        </div>
      )}
      <label class="block">
        <span class="block text-sm mb-1">
          {props.currentImageUrl ? "Replace image:" : "Upload an image:"}
        </span>
        <input
          ref={props.fileInputRef}
          type="file"
          accept="image/*"
          class="block text-sm"
          disabled={props.imageUploading}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) props.onUpload(file);
          }}
        />
      </label>
      {props.imageUploading && <p class="text-sm text-primary">Uploading…</p>}
      {props.imageError && <p class="text-sm text-error">{props.imageError}</p>}
    </div>
  );
}
