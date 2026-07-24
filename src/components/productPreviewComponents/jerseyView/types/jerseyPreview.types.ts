import type { ColorOption } from "@/types/preview"
import type { StaticLogoOption } from "../../../pickerComponents/StaticLogoPicker";
import type { BackLogoTextConfig } from "../../../pickerComponents/TextInsertPicker";

export type JerseyPreviewProps = {
  bgColor: ColorOption;
  stripeColor: ColorOption;
  brandingColor: ColorOption;
  leftChestLogoUrl?: string;
  rightLogo?: StaticLogoOption;
  sponsorLogoUrl?: string;
  sponsorText?: BackLogoTextConfig;
  backLogoUrl?: string;
  backTextConfig?: BackLogoTextConfig;
};
