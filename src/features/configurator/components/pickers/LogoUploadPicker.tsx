"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import PickerSection from "@/components/ui/PickerSection";

type LogoUploadPickerProps = {
  label: string;
  valueLabel: string;
  imageUrl?: string;
  onImageChange: (url?: string) => void;
};

const LogoUploadPicker: React.FC<LogoUploadPickerProps> = ({
  label,
  valueLabel,
  imageUrl,
  onImageChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track blob URLs created by this component so we can revoke them when they
  // are no longer needed. Without revoking, every upload leaks the full image
  // into memory, which on mobile quickly causes "page crashed".
  const createdBlobUrls = useRef<Set<string>>(new Set());

  const revokeBlobUrl = useCallback((url?: string) => {
    if (!url) return;
    if (createdBlobUrls.current.has(url)) {
      URL.revokeObjectURL(url);
      createdBlobUrls.current.delete(url);
    }
  }, []);

  // Revoke any blob URLs this component created when it unmounts, so memory is
  // released when navigating between categories/pages.
  useEffect(() => {
    const blobUrls = createdBlobUrls.current;
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
      blobUrls.clear();
    };
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        onImageChange(undefined);
        return;
      }

      setError(null);
      setUploading(true);

      try {
        // Upload the file to the server (Vercel Blob) so we get a persistent
        // URL that works across sessions/reloads. A local blob: URL would only
        // be valid in the current browser session and would break on /orders.
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Upload failed");
        }

        const data = await res.json();
        onImageChange(data.url);
      } catch (err) {
        console.error("Upload failed:", err);
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        // Reset the input so selecting the same file again re-triggers change.
        e.target.value = "";
      }
    },
    [onImageChange],
  );

  const handleClear = () => {
    // Revoke the current blob URL (if we created it) before clearing.
    revokeBlobUrl(imageUrl);
    onImageChange(undefined);
  };

  return (
    <PickerSection>
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <strong className="text-black">{label}</strong>
        <span className="text-xs text-gray-500">
          {uploading ? "Uploading…" : imageUrl ? valueLabel : "No logo"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-md border text-black border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium hover:bg-gray-100">
          Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {imageUrl && (
          <>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-black text-xs hover:bg-gray-50"
            >
              Remove
            </button>
            <div className="relative h-10 w-10 overflow-hidden rounded border border-gray-200 bg-white">
              <Image
                src={imageUrl}
                alt={`${label} preview`}
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </PickerSection>
  );
};

export default LogoUploadPicker;
