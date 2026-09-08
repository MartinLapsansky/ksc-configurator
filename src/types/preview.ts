import type { StaticImageData } from "next/image";
import type { ProductDefinition } from "@/features/configurator/schemas/productDefinitionSchema";

/**
 * Base shape shared by all colour options. `hex` is used for single-colour
 * products (e.g. jersey stripes/branding), while `hex1`/`hex2`/`hex3` are used
 * for multi-tone products (double/triple colour). A `BaseColorOption` can
 * therefore represent any of the three variants.
 */
export type BaseColorOption = {
  id: string;
  name: string;
  hex?: string;
  hex1?: string;
  hex2?: string;
  hex3?: string;
  file?: StaticImageData | string;
  backFile?: StaticImageData | string;
};

export type ColorOption = BaseColorOption & {
  hex: string;
};

export type DoubleColorOption = BaseColorOption & {
  hex1: string;
  hex2: string;
};

export type TripleColorOption = BaseColorOption & {
  hex1: string;
  hex2: string;
  hex3: string;
};

export type OverlayEntry = {
  key: string;
  layerSrc: string;
  tintHex?: string;
  uploadSrc?: string;
  active: boolean;
};

export type StaticLogoOption = {
  name: string;
  src: string;
};

export type TextConfig = {
  enabled: boolean;
  text: string;
  color: { name: string; hex: string };
};

/**
 * Product configuration stored in the cart and persisted in `OrderItem.config`.
 *
 * New data-driven products populate `productId`, `values` and
 * `definitionSnapshot`. Legacy products (created before the catalogue was
 * database-driven) keep the explicitly typed fields below. Both shapes remain
 * supported so old orders/carts continue to render.
 */
export type ProductConfig = {
  /** Product database id (new data-driven products). */
  productId?: string;
  /** Product slug for new products, or legacy type ("jersey", "halfZip", "crewNeck"). */
  productType: string;
  /** Human-readable product name (e.g. "Jersey Design 146"). */
  productName: string;

  /** Picker values keyed by picker `key` (new data-driven products). */
  values?: Record<string, unknown>;
  /** Snapshot of the product definition used to render the preview/summary. */
  definitionSnapshot?: ProductDefinition;

  // ── Legacy fields (kept for backward compatibility) ──
  bgColor?: BaseColorOption;
  stripeColor?: ColorOption;
  brandingColor?: ColorOption;
  leftChestLogoUrl?: string;
  sponsorLogoUrl?: string;
  rightLogo?: StaticLogoOption;
  rightChestLogoUrl?: string;
  leftSleeveLogoUrl?: string;
  rightSleeveLogoUrl?: string;
  backLogoUrl?: string;
  backTextConfig?: TextConfig;
  frontTextConfig?: TextConfig;
};

export type CartItem = {
  /** Unique identifier for a single cart line item. */
  id: string;
  quantity: number;
  config: ProductConfig;
};

export type OrderItem = {
  id: string;
  quantity: number;
  config: ProductConfig;
  createdAt?: string;
  updatedAt?: string;
};

export type Order = {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  county: string;
  country: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  organisation: string;
  quantity: number;
  message: string;
  productConfig?: ProductConfig;
  items?: OrderItem[];
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};