"use client";

import React from "react";
import Image from "next/image";
import type { StaticLogoOption } from "@/types/preview";
import PickerSection from "@/components/ui/PickerSection";

type StaticLogoPickerProps = {
  label: string;
  options: StaticLogoOption[];
  selected: StaticLogoOption;
  onChange: (option: StaticLogoOption) => void;
};

const StaticLogoPicker: React.FC<StaticLogoPickerProps> = ({
  label,
  options,
  selected,
  onChange,
}) => {
  return (
      <PickerSection>
      <div className="mb-2 flex items-baseline justify-between text-sm">
          <strong className="text-black">{label}</strong>
        <span className="text-xs text-gray-500">{selected?.name}</span>
      </div>
      <div className="flex gap-3">
        {options.map((o) => {
          const isSelected = o.name === selected?.name;
          return (
            <button
              key={o.name}
              type="button"
              onClick={() => onChange(o)}
              className={`flex h-12 w-12 items-center justify-center rounded-md border bg-white p-1 text-xs transition ${
                isSelected
                  ? "border-black ring-2 ring-black"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              <Image
                src={o.src}
                alt={o.name}
                width={48}
                height={48}
                className="max-h-full max-w-full object-contain"
              />
            </button>
          );
        })}
      </div>
    </PickerSection>
  );
};

export default StaticLogoPicker;