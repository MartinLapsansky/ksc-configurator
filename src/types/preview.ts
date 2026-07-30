import type { StaticImageData } from "next/image";

export type ColorOption = {
  id: string;
  name: string;
  hex: string;
  file?: StaticImageData | string;
  backFile?: StaticImageData | string;
};

export type DoubleColorOption = {
  id: string;
  name: string;
  hex1: string;
  hex2: string;
  file?: StaticImageData | string;
};

export type TripleColorOption = {
  id: string;
  name: string;
  hex1: string;
  hex2: string;
  hex3: string;
  file?: StaticImageData | string;
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
 * `bgColor` accepts both ColorOption (single-color) and DoubleColorOption (two-tone).
 */
export type ProductConfig = {
  productType: ProductType;
  bgColor?: ColorOption | DoubleColorOption | TripleColorOption;
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
