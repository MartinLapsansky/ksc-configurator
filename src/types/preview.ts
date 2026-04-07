export type ColorOption = {
  name: string;
  hex: string;
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
  jerseyConfig: JerseyConfig;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};