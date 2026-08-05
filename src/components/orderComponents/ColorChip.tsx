"use client";

import React from "react";
import type { BaseColorOption, ColorOption, DoubleColorOption } from "@/types/preview";

type ColorChipProps = {
  label: string;
  color?: BaseColorOption;
};


export default function ColorChip({ label, color }: ColorChipProps) {
  if (!color) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400">
        {label}: Not set
      </div>
    );
  }

  // Check if it's a DoubleColorOption (has hex1/hex2)
  const isDouble = "hex1" in color && "hex2" in color;

  if (isDouble) {
    const doubleColor = color as DoubleColorOption;
    return (
      <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
        <div className="flex -space-x-1">
          <span
            className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: doubleColor.hex1 }}
            aria-hidden="true"
          />
          <span
            className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: doubleColor.hex2 }}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-black">{label}</div>
          <div className="text-xs text-gray-500">
            {doubleColor.name} · <span className="font-mono">{doubleColor.hex1}</span> / <span className="font-mono">{doubleColor.hex2}</span>
          </div>
        </div>
      </div>
    );
  }

  const singleColor = color as ColorOption;
  return (
    <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
      <span
        className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
        style={{ backgroundColor: singleColor.hex }}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <div className="text-xs font-medium text-black">{label}</div>
        <div className="text-xs text-gray-500">
          {singleColor.name} · <span className="font-mono">{singleColor.hex}</span>
        </div>
      </div>
    </div>
  );
}
