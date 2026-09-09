"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

type UploadedAsset = {
  url: string;
  fileName: string;
};

function fileNameFromUrl(url: string): string {
  try {
    const lastSegment = url.split("/").filter(Boolean).pop();
    return lastSegment ? decodeURIComponent(lastSegment) : url;
  } catch {
    return url;
  }
}

type ImageAssetUploaderProps = {
  label?: string;
  /**
   * Existing public Vercel Blob URLs already referenced by the product
   * definition. They are rendered like newly uploaded assets so an admin can
   * review and delete them while editing an existing product.
   */
  initialUrls?: string[];
  /**
   * Called after an asset has been successfully deleted from storage. Lets the
   * parent (ProductForm) remove the URL references from the definition JSON.
   */
  onDeleteUrlAction?: (url: string) => void;
};

/**
 * Admin helper for product images. Uploads one or more images to
 * `/api/upload` (persisted to Vercel Blob) and shows the resulting public URLs
 * with a copy button so they can be pasted into a product definition JSON.
 *
 * This lets a non-developer upload base/layer/logo images without committing
 * them to the repository's `public/` folder.
 */
export default function ImageAssetUploader({
  label = "Upload product images",
  initialUrls = [],
  onDeleteUrlAction,
}: ImageAssetUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<UploadedAsset[]>(() =>
    initialUrls.map((url) => ({
      url,
      fileName: fileNameFromUrl(url),
    })),
  );
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    for (const file of files) {
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

        const data = (await res.json()) as { url: string; fileName: string };
        setAssets((prev) => [
          ...prev,
          { url: data.url, fileName: data.fileName },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    } catch {
      setError("Could not copy to clipboard. Copy the URL manually.");
    }
  };

  const deleteAsset = async (url: string) => {
    setDeletingUrl(url);
    setError(null);

    try {
      const res = await fetch("/api/admin/blob", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Delete failed");
      }

      setAssets((prev) => prev.filter((asset) => asset.url !== url));
      onDeleteUrlAction?.(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingUrl(null);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
      <label className="block text-sm font-medium text-black">{label}</label>
      <p className="mt-1 text-xs text-gray-500">
        Upload base, layer, or logo images. The returned URL is public and
        persistent — paste it into the definition JSON.
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-3 rounded-md cursor-pointer bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload images"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
        disabled={uploading}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {assets.length > 0 && (
        <ul className="mt-3 space-y-2">
          {assets.map((asset) => (
            <li
              key={asset.url}
              className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-2"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-gray-200 bg-white">
                <Image
                  src={asset.url}
                  alt={asset.fileName}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-mono text-gray-700">
                  {asset.fileName}
                </p>
                <p className="truncate text-[11px] font-mono text-gray-500">
                  {asset.url}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyUrl(asset.url)}
                className="shrink-0 rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-xs font-medium text-black hover:bg-gray-100"
              >
                {copiedUrl === asset.url ? "Copied" : "Copy URL"}
              </button>
              <button
                type="button"
                onClick={() => deleteAsset(asset.url)}
                disabled={deletingUrl === asset.url}
                className="shrink-0 rounded-md border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deletingUrl === asset.url ? "Deleting…" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}