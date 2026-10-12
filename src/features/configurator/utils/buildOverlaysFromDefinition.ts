import type { OverlayEntry } from "@/types/preview";
import type {
  OverlayLayerDef,
  ProductDefinition,
} from "@/features/configurator/schemas/productDefinitionSchema";

type ConfigValues = Record<string, unknown>;

/**
 * Builds the canvas overlay entries for a data-driven product definition.
 * Replaces the hardcoded `buildOverlays.ts` by resolving each layer's
 * `source` against the currently selected picker values.
 */
export function buildOverlaysFromDefinition(
  definition: ProductDefinition,
  values: ConfigValues,
  isBackView: boolean,
): OverlayEntry[] {
  const layers = isBackView
    ? definition.overlays.back ?? []
    : definition.overlays.front;

  return layers.map((layer) => buildOverlayEntry(layer, values));
}

function buildOverlayEntry(
  layer: OverlayLayerDef,
  values: ConfigValues,
): OverlayEntry {
  const source = layer.source;
  const raw = values[source.pickerKey];

  switch (source.type) {
    case "tint": {
      const hex = readHex(raw);
      return {
        key: layer.key,
        layerSrc: layer.layerUrl,
        tintHex: hex,
        active: !!hex,
      };
    }

    case "upload": {
      const uploadSrc = typeof raw === "string" ? raw : undefined;
      return {
        key: layer.key,
        layerSrc: layer.layerUrl,
        uploadSrc,
        active: !!uploadSrc,
      };
    }

    case "staticLogo": {
      const logoName = readName(raw);
      const resolvedLayer = logoName
        ? source.logoMap[logoName] ?? undefined
        : undefined;
      return {
        key: layer.key,
        layerSrc: resolvedLayer ?? "",
        active: !!resolvedLayer,
      };
    }
  }
}

function readHex(raw: unknown): string | undefined {
  if (raw && typeof raw === "object" && "hex" in raw) {
    const value = (raw as { hex?: unknown }).hex;
    return typeof value === "string" ? value : undefined;
  }
  return undefined;
}

function readName(raw: unknown): string | undefined {
  if (raw && typeof raw === "object" && "name" in raw) {
    const value = (raw as { name?: unknown }).name;
    return typeof value === "string" ? value : undefined;
  }
  return undefined;
}