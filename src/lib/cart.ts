"use client";

import type { ProductConfig } from "@/types/preview";

export const PRODUCT_TYPE_LABELS: Record<
  ProductConfig["productType"],
  string
> = {
  jersey: "Jersey",
  halfZip: "Half Zip",
  crewNeck: "Crew Neck",
};

export function getThumbnail(config: ProductConfig): string | null {
  const file = config.bgColor?.file;
  if (!file) return null;
  if (typeof file === "string") return file;
  return file.src ?? null;
}