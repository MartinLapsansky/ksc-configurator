"use client";

import React, { useCallback, useState } from "react";

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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        onImageChange(undefined);
        return;
      }

      try {
        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = (await res.json()) as { url?: string };
        if (!data.url) {
          throw new Error("Upload response missing URL");
        }

        onImageChange(data.url);
      } catch (error) {
        console.error(error);
        setUploadError("Failed to upload image.");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    [onImageChange],
  );

  const handleClear = () => {
    onImageChange(undefined);
    setUploadError(null);
  };

  return (
    <section className="mb-4 min-w-[50vw] rounded-md border border-gray-200 bg-white p-3 shadow-sm md:min-w-0 md:w-full">
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <strong className="text-black">{label}</strong>
        <span className="text-xs text-gray-500">
          {imageUrl ? valueLabel : "No logo"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-black hover:bg-gray-100">
          {uploading ? "Uploading..." : "Upload"}
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
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
            >
              Remove
            </button>

            <div className="h-10 w-10 overflow-hidden rounded border border-gray-200 bg-white">
              <img
                src={imageUrl}
                alt={`${label} preview`}
                className="h-full w-full object-contain"
              />
            </div>
          </>
        )}
      </div>

      {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
    </section>
  );
};

export default LogoUploadPicker;