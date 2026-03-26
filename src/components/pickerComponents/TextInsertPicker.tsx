"use client";

import React, { useCallback } from "react";
import { ColorOption } from "./ColorSwatchPicker";

export type BackLogoTextConfig = {
  enabled: boolean;
  text: string;
  color: ColorOption;
};

type TextInsertPickerProps = {
  label: string;
  value: BackLogoTextConfig;
  colorOptions: ColorOption[];
  onChange: (config: BackLogoTextConfig) => void;
};

const TextInsertPicker: React.FC<TextInsertPickerProps> = ({
  label,
  value,
  colorOptions,
  onChange,
}) => {
  const handleToggleChange = useCallback(
    (enabled: boolean) => {
      onChange({
        ...value,
        enabled,
        text: enabled ? value.text : "",
      });
    },
    [value, onChange]
  );

  const handleTextChange = useCallback(
    (text: string) => {
      onChange({
        ...value,
        text,
      });
    },
    [value, onChange]
  );

  const handleColorChange = useCallback(
    (color: ColorOption) => {
      onChange({
        ...value,
        color,
      });
    },
    [value, onChange]
  );

  return (
      <section className="mb-4 min-w-[50vw] md:min-w-0 md:w-full rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between text-sm">
          <strong className="text-black">{label}</strong>
        <span className="text-xs text-gray-500">
          {value.enabled ? (value.text || "No text") : "Disabled"}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.enabled}
              onChange={(e) => handleToggleChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm font-medium text-black">Enable back logo text</span>
          </label>
        </div>

        {value.enabled && (
          <>
            <div className="flex items-center gap-3 text-black">
              <input
                type="text"
                value={value.text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter text for back logo"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm  focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                maxLength={50}
              />
              <span className="text-xs text-gray-500">
                {value.text.length}/50
              </span>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-gray-700">Text Color</div>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => {
                  const isSelected = color.name === value.color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className={`h-6 w-6 rounded-full border transition-transform ${
                        isSelected
                          ? "scale-105 border-black ring-2 ring-black"
                          : "border-gray-300 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TextInsertPicker;
