// ---------------------------------------------------------------------------
// Image upload hook – extracted from CharacterSheetEditor
// ---------------------------------------------------------------------------

import { type RefObject } from "preact";
import { useRef, useState } from "preact/hooks";

interface UseImageUploadOptions {
  initialImageUrl: string;
  characterId?: string;
  action: "create" | "update";
}

export interface ImageUploadState {
  currentImageUrl: string;
  pendingImageId: string;
  imageUploading: boolean;
  imageError: string;
  fileInputRef: RefObject<HTMLInputElement>;
  handleImageUpload: (file: File) => Promise<void>;
  handleImageDelete: () => Promise<void>;
}

export function useImageUpload(options: UseImageUploadOptions): ImageUploadState {
  const { initialImageUrl, characterId, action } = options;

  const [currentImageUrl, setCurrentImageUrl] = useState(initialImageUrl);
  const [pendingImageId, setPendingImageId] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(file: File) {
    setImageUploading(true);
    setImageError("");

    try {
      // 1. Get a direct upload URL
      const isUpdate = action === "update" && characterId;
      const urlEndpoint = isUpdate
        ? `/api/characters/${characterId}/image`
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
          `/api/characters/${characterId}/image`,
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
      if (action === "update" && characterId) {
        const res = await fetch(
          `/api/characters/${characterId}/image`,
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

  return {
    currentImageUrl,
    pendingImageId,
    imageUploading,
    imageError,
    fileInputRef,
    handleImageUpload,
    handleImageDelete,
  };
}
