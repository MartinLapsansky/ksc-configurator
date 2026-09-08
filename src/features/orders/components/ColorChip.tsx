"use client";

import React from "react";
import type {
  BaseColorOption,
  ColorOption,
  DoubleColorOption,
  TripleColorOption,
} from "@/types/preview";

type ColorChipProps = {
  label: string;
  color?: BaseColorOption;
};

function isTripleColorOption(
  color: BaseColorOption,
): color is TripleColorOption {
  return "hex1" in color && "hex2" in color && "hex3" in color;
}

function isDoubleColorOption(
  color: BaseColorOption,
): color is DoubleColorOption {
  return "hex1" in color && "hex2" in color;
}

function isColorOption(color: BaseColorOption): color is ColorOption {
  return typeof color.hex === "string";
}

export default function ColorChip({ label, color }: ColorChipProps) {
  if (!color) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400">
        {label}: Not set
      </div>
    );
  }

  if (isTripleColorOption(color)) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
        <div className="flex -space-x-1">
          <span
            className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: color.hex1 }}
            aria-hidden="true"
          />
          <span
            className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: color.hex2 }}
            aria-hidden="true"
          />
          <span
            className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: color.hex3 }}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-black">{label}</div>
          <div className="text-xs text-gray-500">
            {color.name} · <span className="font-mono">{color.hex1}</span> /{" "}
            <span className="font-mono">{color.hex2}</span> /{" "}
            <span className="font-mono">{color.hex3}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isDoubleColorOption(color)) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
        <div className="flex -space-x-1">
          <span
            className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: color.hex1 }}
            aria-hidden="true"
          />
          <span
            className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: color.hex2 }}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-black">{label}</div>
          <div className="text-xs text-gray-500">
            {color.name} · <span className="font-mono">{color.hex1}</span> /{" "}
            <span className="font-mono">{color.hex2}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isColorOption(color)) {
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

  return (
    <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-400">
      {label}: {color.name}
    </div>
  );
}