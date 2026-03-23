"use client";

import React from "react";

export type ColorOption = {
  name: string;
  hex: string;
  file?: string;
};

type ColorSwatchPickerProps = {
  label: string;
  valueLabel: string;
  options: ColorOption[];
  selected: ColorOption;
  onChange: (option: ColorOption) => void;
};

const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  label,
  valueLabel,
  options,
  selected,
  onChange,
}) => {
  return (
    <section className="mb-4 rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <strong>{label}</strong>
        <span className="text-xs text-gray-500">{valueLabel}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const isSelected = o.name === selected.name;
          return (
            <button
              key={o.name}
              type="button"
              onClick={() => onChange(o)}
              className={`h-7 w-7 rounded-full border transition-transform ${
                isSelected
                  ? "scale-105 border-black ring-2 ring-black"
                  : "border-gray-300 hover:scale-105"
              }`}
              style={{ backgroundColor: o.hex }}
              title={o.name}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ColorSwatchPicker;