"use client";

import React from "react";
import type {
  PickerDef,
  ProductDefinition,
} from "@/features/configurator/schemas/productDefinitionSchema";

import ColorSwatchPicker from "@/features/configurator/components/pickers/ColorSwatchPicker";
import DoubleColorSwatchPicker from "@/features/configurator/components/pickers/DoubleColorSwatchPicker";
import TripleColorSwatchPicker from "@/features/configurator/components/pickers/TripleColorSwatchPicker";
import LogoUploadPicker from "@/features/configurator/components/pickers/LogoUploadPicker";
import StaticLogoPicker from "@/features/configurator/components/pickers/StaticLogoPicker";
import TextInsertPicker from "@/features/configurator/components/pickers/TextInsertPicker";

import type { ColorOption, TextConfig } from "@/types/preview";

type ProductConfiguratorPickersProps = {
  definition: ProductDefinition;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
};

/**
 * Renders the configured pickers for a product from its definition. Maps each
 * `PickerDef` to the appropriate picker primitive.
 */
const ProductConfiguratorPickers: React.FC<ProductConfiguratorPickersProps> = ({
  definition,
  values,
  onChange,
}) => {
  return (
    <>
      {definition.pickers.map((picker) => (
        <PickerRenderer
          key={picker.key}
          picker={picker}
          value={values[picker.key]}
          onChange={(value) => onChange(picker.key, value)}
        />
      ))}
    </>
  );
};

type PickerRendererProps = {
  picker: PickerDef;
  value: unknown;
  onChange: (value: unknown) => void;
};

function PickerRenderer({ picker, value, onChange }: PickerRendererProps) {
  switch (picker.type) {
    case "color":
      return (
        <ColorSwatchPicker
          label={picker.label}
          valueLabel={readName(value) ?? ""}
          options={picker.options as ColorOption[]}
          selected={(value ?? picker.options[0]) as ColorOption}
          onChange={onChange}
        />
      );

    case "doubleColor":
      return (
        <DoubleColorSwatchPicker
          label={picker.label}
          valueLabel={readName(value) ?? ""}
          options={picker.options}
          selected={(value ?? picker.options[0]) as never}
          onChange={onChange}
        />
      );

    case "tripleColor":
      return (
        <TripleColorSwatchPicker
          label={picker.label}
          valueLabel={readName(value) ?? ""}
          options={picker.options}
          selected={(value ?? picker.options[0]) as never}
          onChange={onChange}
        />
      );

    case "imageUpload":
      return (
        <LogoUploadPicker
          label={picker.label}
          valueLabel="Custom logo"
          imageUrl={typeof value === "string" ? value : undefined}
          onImageChange={(url) => onChange(url)}
        />
      );

    case "staticLogo":
      return (
        <StaticLogoPicker
          label={picker.label}
          options={picker.options}
          selected={(value ?? picker.options[0]) as never}
          onChange={onChange}
        />
      );

    case "text":
      return (
        <TextInsertPicker
          label={picker.label}
          value={toTextConfig(value, picker.colorOptions)}
          colorOptions={picker.colorOptions as ColorOption[]}
          onChange={(config) => onChange(config)}
        />
      );
  }
}

function readName(value: unknown): string | undefined {
  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name?: unknown }).name;
    return typeof name === "string" ? name : undefined;
  }
  return undefined;
}

function toTextConfig(
  value: unknown,
  colorOptions: { id: string; name: string; hex: string }[],
): TextConfig {
  if (value && typeof value === "object") {
    const obj = value as {
      enabled?: boolean;
      text?: string;
      color?: { name: string; hex: string };
    };
    return {
      enabled: obj.enabled ?? false,
      text: obj.text ?? "",
      color: obj.color ?? colorOptions[0],
    };
  }

  return {
    enabled: false,
    text: "",
    color: colorOptions[0],
  };
}

export default ProductConfiguratorPickers;