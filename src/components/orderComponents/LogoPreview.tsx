"use client";

import React from "react";
import Image from "next/image";

type LogoPreviewProps = {
  label: string;
  src?: string;
  placeholder?: string;
};

export default function LogoPreview({
  label,
  src,
  placeholder = "Not set",
}: LogoPreviewProps) {
  if (!src) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-400">
        {label}: {placeholder}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <div className="mb-2 text-xs font-medium text-black">{label}</div>

      <div className="flex items-center gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          <Image width={15} height={15} src={src} alt={label} className="h-full w-full object-contain" />
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Open
          </a>
          <a
            href={src}
            download
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}