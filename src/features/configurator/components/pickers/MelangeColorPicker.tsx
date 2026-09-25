"use client";

import React from "react";
import Image from "next/image";
import type { MelangeColorOption } from "@/types/preview";
import PickerSection from "@/components/ui/PickerSection";

type MelangeColorPickerProps = {
  label: string;
  valueLabel: string;
  options: MelangeColorOption[];
  selected: MelangeColorOption;
  onChange: (option: MelangeColorOption) => void;
};

/**
 * Resolves the CSS `background` for a melange option's swatch. The first
 * available representation wins: pattern (handled by the caller via an image),
 * then triple, double and finally single colour.
 */
function melangeSwatchBackground(option: MelangeColorOption): string | undefined {
  if (option.hex1 && option.hex2 && option.hex3) {
    return `linear-gradient(135deg, ${option.hex1} 33%, ${option.hex2} 33%, ${option.hex2} 66%, ${option.hex3} 66%)`;
  }

  if (option.hex1 && option.hex2) {
    return `linear-gradient(135deg, ${option.hex1} 50%, ${option.hex2} 50%)`;
  }

  return option.hex;
}

/**
 * Picker for `melange` options. A single picker may mix solid, double, triple
 * and pattern (fabric/texture) options, so each swatch decides how to render
 * itself: a pattern image when a `pattern` is defined, otherwise a solid or
 * gradient swatch derived from the option's hex values.
 */
const MelangeColorPicker: React.FC<MelangeColorPickerProps> = ({
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
        {options.map((option) => {
          const isSelected = option.id === selected?.id;
          const background = melangeSwatchBackground(option);
          const selectionClass = isSelected
            ? "scale-105 border-black ring-2 ring-black"
            : "border-gray-300 hover:scale-105";

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option)}
              className={`relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border transition-transform ${selectionClass}`}
              style={option.pattern ? undefined : { background }}
              title={option.name}
            >
              {option.pattern && (
                <Image
                  src={option.pattern}
                  alt={option.name}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              )}
            </button>
          );
        })}
      </div>
    </PickerSection>
  );
};

export default MelangeColorPicker;