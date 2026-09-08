"use client";

import React from "react";
import type { TextConfig } from "@/types/preview";

type TextConfigPreviewProps = {
  label: string;
  config?: TextConfig;
};

export default function TextConfigPreview({
  label,
  config,
}: TextConfigPreviewProps) {
  if (!config?.enabled || !config.text) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400">
        {label}: Not set
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <div className="text-xs font-medium text-black">{label}</div>
      <div className="mt-1 text-sm text-gray-700">{config.text}</div>
      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
        <span
          className="h-3 w-3 rounded-full border border-black/10"
          style={{ backgroundColor: config.color.hex }}
          aria-hidden="true"
        />
        <span>{config.color.name}</span>
        <span className="font-mono">({config.color.hex})</span>
      </div>
    </div>
  );
}