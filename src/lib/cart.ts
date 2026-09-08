"use client";

import type { ProductConfig } from "@/types/preview";

/**
 * Resolves a human-readable label for the product in a cart/order line.
 * Data-driven products carry their own `productName`; legacy products keep a
 * fixed `productType` label.
 */
export function getProductTypeLabel(config: ProductConfig): string {
  return (
    config.productName ||
    LEGACY_PRODUCT_TYPE_LABELS[config.productType] ||
    config.productType
  );
}

const LEGACY_PRODUCT_TYPE_LABELS: Record<string, string> = {
  jersey: "Jersey",
  halfZip: "Half Zip",
  crewNeck: "Crew Neck",
};

/**
 * Resolves a thumbnail URL for a cart/order line item.
 *
 * Data-driven products resolve the selected base-image picker value; legacy
 * products fall back to `bgColor.file`.
 */
export function getSelectedColorName(config: ProductConfig): string | undefined {
  if (config.definitionSnapshot && config.values) {
    const baseImagePickerKey = config.definitionSnapshot.baseImage?.pickerKey;
    if (baseImagePickerKey) {
      const raw = config.values[baseImagePickerKey];
      if (raw && typeof raw === "object" && "name" in raw) {
        const name = (raw as { name?: unknown }).name;
        if (typeof name === "string") return name;
      }
    }
  }

  return config.bgColor?.name;
}

export function getThumbnail(config: ProductConfig): string | null {
  if (config.definitionSnapshot && config.values) {
    const baseImagePickerKey = config.definitionSnapshot.baseImage?.pickerKey;
    if (baseImagePickerKey) {
      const raw = config.values[baseImagePickerKey];
      if (raw && typeof raw === "object") {
        const imageUrl = (raw as { imageUrl?: string }).imageUrl;
        if (imageUrl) return imageUrl;
      }
    }
  }

  const file = config.bgColor?.file;
  if (!file) return null;
  if (typeof file === "string") return file;
  return file.src ?? null;
}