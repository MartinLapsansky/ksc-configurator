import type { StaticImageData } from "next/image";

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
  color: ColorOption;
};

export type JerseyConfig = {
  bgColor?: ColorOption;
  stripeColor?: ColorOption;
  brandingColor?: ColorOption;
  leftChestLogoUrl?: string;
  sponsorLogoUrl?: string;
  rightLogo?: StaticLogoOption;
  backLogoUrl?: string;
  backTextConfig?: TextConfig;
  frontTextConfig?: TextConfig;
};

export type HalfZipConfig = {
  bgColor?: DoubleColorOption;
  leftChestLogoUrl?: string;
  rightChestLogoUrl?: string;
};

export type CrewNeckConfig = {
  bgColor?: TripleColorOption;
  leftChestLogoUrl?: string;
  rightChestLogoUrl?: string;
  backLogoUrl?: string;
};

export type ProductType = "jersey" | "halfZip" | "crewNeck";

/**
 * General product configuration that can hold config for any product type.
 * The `productType` field discriminates which config is relevant.
 * `bgColor` accepts any colour variant (single, double or triple tone).
 */
export type ProductConfig = {
  productType: ProductType;
  bgColor?: BaseColorOption;

  // Jersey-specific fields
  stripeColor?: ColorOption;
  brandingColor?: ColorOption;
  leftChestLogoUrl?: string;
  sponsorLogoUrl?: string;
  rightLogo?: StaticLogoOption;
  rightChestLogoUrl?: string;
  backLogoUrl?: string;
  backTextConfig?: TextConfig;
  frontTextConfig?: TextConfig;
};

export type Order = {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  organisation: string;
  quantity: number;
  leadTime: string;
  message: string;
  productConfig: ProductConfig;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};
