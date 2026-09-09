import type {
  PickerDef,
  ProductDefinition,
} from "@/features/configurator/schemas/productDefinitionSchema";

type ConfigValues = Record<string, unknown>;

/**
 * Creates the initial configuration values from the product definition, so every
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
/**
 * Reconciles previously selected values against a (possibly changed)
 * definition. Keeps the current selection for each picker by matching `id`
 * (or `name` for static logos) while refreshing the stored option to the new
 * definition's version. This ensures edits to option data (e.g. changing or
 * removing an `imageUrl`) are reflected without losing the user's selection.
 */
export function reconcileValues(
  definition: ProductDefinition,
  previous: ConfigValues,
): ConfigValues {
  const values: ConfigValues = {};

  for (const picker of definition.pickers) {
    values[picker.key] = reconcileForPicker(picker, previous[picker.key]);
  }

  return values;
}

function reconcileForPicker(picker: PickerDef, current: unknown): unknown {
  switch (picker.type) {
    case "color":
    case "doubleColor":
    case "tripleColor": {
      const selectedId = readStringProp(current, "id");
      const match =
        selectedId !== undefined
          ? picker.options.find((option) => option.id === selectedId)
          : undefined;
      return match ?? picker.options[0];
    }

    case "staticLogo": {
      const selectedName = readStringProp(current, "name");
      const match =
        selectedName !== undefined
          ? picker.options.find((option) => option.name === selectedName)
          : undefined;
      return match ?? picker.options[0];
    }

    case "imageUpload":
      return typeof current === "string" ? current : undefined;

    case "text": {
      const previousText = current as
        | { enabled?: boolean; text?: string; color?: unknown }
        | undefined;
      const colorId = readStringProp(previousText?.color, "id");
      const color =
        colorId !== undefined
          ? picker.colorOptions.find((option) => option.id === colorId)
          : undefined;
      return {
        enabled: previousText?.enabled ?? false,
        text: previousText?.text ?? "",
        color: color ?? picker.colorOptions[0],
      };
    }
  }
}

function readStringProp(
  value: unknown,
  prop: string,
): string | undefined {
  if (value && typeof value === "object") {
    const candidate = (value as Record<string, unknown>)[prop];
    return typeof candidate === "string" ? candidate : undefined;
  }
  return undefined;
}

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