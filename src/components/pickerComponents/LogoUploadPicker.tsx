"use client";

import React, { useCallback, useEffect, useRef } from "react";

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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        onImageChange(undefined);
        return;
      }
      const url = URL.createObjectURL(file);
      createdBlobUrls.current.add(url);
      onImageChange(url);
    },
    [onImageChange],
  );

  const handleClear = () => {
    // Revoke the current blob URL (if we created it) before clearing.
    revokeBlobUrl(imageUrl);
    onImageChange(undefined);
  };

  return (
    <section className="mb-4 min-w-[50vw] md:min-w-0 md:w-full rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <strong className="text-black">{label}</strong>
        <span className="text-xs text-gray-500">
          {imageUrl ? valueLabel : "No logo"}
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
    </section>
  );
};

export default LogoUploadPicker;
