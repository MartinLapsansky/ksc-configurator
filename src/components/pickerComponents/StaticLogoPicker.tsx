"use client";

import React from "react";

export type StaticLogoOption = {
  name: string;
  src: string;
};

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
      <section className="mb-4 min-w-[50vw] md:min-w-0 md:w-full rounded-md border border-gray-200 bg-white p-3 shadow-sm">
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
              <img
                src={o.src}
                alt={o.name}
                className="max-h-full max-w-full object-contain"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default StaticLogoPicker;