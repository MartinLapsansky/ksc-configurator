import type { ColorOption, StaticLogoOption, TextConfig } from "@/types/preview";

export type JerseyPreviewProps = {
  bgColor: ColorOption;
  stripeColor: ColorOption;
  brandingColor: ColorOption;
  leftChestLogoUrl?: string;
  rightLogo?: StaticLogoOption;
  sponsorLogoUrl?: string;
  sponsorText?: TextConfig;
  rightSleeveLogoUrl?: string;
  leftSleeveLogoUrl?: string;
  backLogoUrl?: string;
  backTextConfig?: TextConfig;
};
