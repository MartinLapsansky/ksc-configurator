"use client";

import React from "react";
import type { ColorOption } from "@/types/preview";

type ColorChipProps = {
  label: string;
  color?: ColorOption;
};

export default function ColorChip({ label, color }: ColorChipProps) {
  if (!color) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400">
        {label}: Not set
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
      <span
        className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
        style={{ backgroundColor: color.hex }}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <div className="text-xs font-medium text-black">{label}</div>
        <div className="text-xs text-gray-500">
          {color.name} · <span className="font-mono">{color.hex}</span>
        </div>
      </div>
    </div>
  );
}