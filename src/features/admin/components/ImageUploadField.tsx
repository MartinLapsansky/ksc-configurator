"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChangeAction: (url: string) => void;
};

/**
 * Uploads an image to `/api/upload` (Vercel Blob) and returns its public URL,
 * or accepts a manually pasted public URL.
 */
export default function ImageUploadField({
  label,
  value,
  onChangeAction,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
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
      onChangeAction(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-black">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChangeAction(e.target.value)}
          placeholder="/products/... or https://..."
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-medium text-black hover:bg-gray-100 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </div>

      {value && (
        <div className="relative mt-2 h-16 w-16 overflow-hidden rounded border border-gray-200 bg-white">
          <Image src={value} alt={label} fill sizes="64px" className="object-contain" />
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}