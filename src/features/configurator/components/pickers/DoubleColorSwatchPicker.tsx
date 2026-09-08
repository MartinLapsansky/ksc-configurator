"use client";

import React from "react";
import type { DoubleColorOption } from "@/types/preview";
import PickerSection from "@/components/ui/PickerSection";

type DoubleColorSwatchPickerProps = {
  label: string;
  valueLabel: string;
  options: DoubleColorOption[];
  selected: DoubleColorOption;
  onChange: (option: DoubleColorOption) => void;
};

const DoubleColorSwatchPicker: React.FC<DoubleColorSwatchPickerProps> = ({
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
              style={{
                background: `linear-gradient(135deg, ${o.hex1} 50%, ${o.hex2} 50%)`,
              }}
              title={o.name}
            />
          );
        })}
      </div>
    </PickerSection>
  );
};

export default DoubleColorSwatchPicker;
