"use client";

import React from "react";
import type { ColorOption } from "@/types/preview";
import PickerSection from "@/components/ui/PickerSection";

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
      <PickerSection>
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <strong className="text-black">{label}</strong>
        <span className="text-xs text-black">{valueLabel}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const isSelected = o.name === selected.name;
          return (
            <button
              key={o.name}
              type="button"
              onClick={() => onChange(o)}
              className={`h-7 w-7 rounded-full cursor-pointer border transition-transform ${
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
    </PickerSection>
  );
};

export default ColorSwatchPicker;