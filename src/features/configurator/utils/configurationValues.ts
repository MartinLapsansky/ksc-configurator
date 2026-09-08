import type {
  PickerDef,
  ProductDefinition,
} from "@/features/configurator/schemas/productDefinitionSchema";

type ConfigValues = Record<string, unknown>;

/**
 * Creates the initial configuration values from the product definition so every
 * picker starts on its first option (or an empty value for uploads/text).
 */
export function buildDefaultValues(
  definition: ProductDefinition,
): ConfigValues {
  const values: ConfigValues = {};

  for (const picker of definition.pickers) {
    values[picker.key] = defaultForPicker(picker);
  }

  return values;
}

function defaultForPicker(picker: PickerDef): unknown {
  switch (picker.type) {
    case "color":
    case "doubleColor":
    case "tripleColor":
    case "staticLogo":
      return picker.options[0];

    case "imageUpload":
      return undefined;

    case "text":
      return {
        enabled: false,
        text: "",
        color: picker.colorOptions[0],
      };
  }
}

/**
 * Resolves the front/back base image URL. If the definition declares a base
 * image picker, its selected option provides the image; otherwise the
 * product-level fallback image is used.
 */
export function resolveBaseImageSrc(
  definition: ProductDefinition,
  values: ConfigValues,
  isBackView: boolean,
  fallback?: {
    frontImageUrl?: string | null;
    backImageUrl?: string | null;
  },
): string {
  const baseImagePickerKey = definition.baseImage?.pickerKey;

  if (baseImagePickerKey) {
    const raw = values[baseImagePickerKey];
    if (raw && typeof raw === "object") {
      const option = raw as {
        imageUrl?: string;
        backImageUrl?: string;
      };
      if (isBackView) {
        return option.backImageUrl ?? option.imageUrl ?? "";
      }
      return option.imageUrl ?? option.backImageUrl ?? "";
    }
  }

  return isBackView
    ? fallback?.backImageUrl ?? fallback?.frontImageUrl ?? ""
    : fallback?.frontImageUrl ?? "";
}