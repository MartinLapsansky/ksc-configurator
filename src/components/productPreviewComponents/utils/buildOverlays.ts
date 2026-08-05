import type { OverlayEntry } from "@/types/preview";
import type { ColorOption } from "@/types/preview";
import type { StaticLogoOption } from "@/components/pickerComponents/StaticLogoPicker";

// ── Jersey layer images ──
import stripeImgLayer from "@/app/assets/jerseys/layers/front-stripes-layer.png";
import backStripeImgLayer from "@/app/assets/jerseys/layers/back-stripes-layer.png";
import brandImg from "@/app/assets/jerseys/layers/kcs-logo-layer.png";
import leftChestImg from "@/app/assets/jerseys/layers/crest-logo-layer.png";
import rightLogoGaaImg from "@/app/assets/jerseys/layers/gaa-logo-layer.png";
import rightLogoCamogieImg from "@/app/assets/jerseys/layers/camogie-logo-layer.png";
import rightLogoLgfaImg from "@/app/assets/jerseys/layers/lgfa-logo-layer.png";
import sponsorLogoImg from "@/app/assets/jerseys/layers/sponsor-logo-layer.png";
import backSponsorLogoImg from "@/app/assets/jerseys/layers/back-sponsor-logo-layer.png";

// ── Half Zip layer images ──
import halfZipLeftChestLayer from "@/app/assets/zip-tops/layers/left_chest_logo_layer.png";
import halfZipRightChestLayer from "@/app/assets/zip-tops/layers/right_chest_logo_layer.png";

// ── CrewNeck layer images ──
import crewNeckLeftChestLayer from "@/app/assets/crewnecks/layers/left_logo_layer.png";
import crewNeckRightChestLayer from "@/app/assets/crewnecks/layers/right_logo_layer.png";
import crewNeckBackLayer from "@/app/assets/crewnecks/layers/back_logo_layer.png";

export const RIGHT_LOGO_LAYER_MAP: Record<string, typeof rightLogoGaaImg> = {
  Gaa: rightLogoGaaImg,
  Camogie: rightLogoCamogieImg,
  Lgfa: rightLogoLgfaImg,
};



// ── Jersey front overlays ──

type BuildFrontOverlaysParams = {
  stripeColor: ColorOption;
  brandingColor: ColorOption;
  leftChestLogoUrl?: string;
  rightLogo?: StaticLogoOption;
  sponsorLogoUrl?: string;
};

export const buildFrontOverlays = ({
  stripeColor,
  brandingColor,
  leftChestLogoUrl,
  rightLogo,
  sponsorLogoUrl,
}: BuildFrontOverlaysParams): OverlayEntry[] => {
  const list: OverlayEntry[] = [];

  list.push({
    key: "front-stripes",
    layerSrc: stripeImgLayer.src,
    tintHex: stripeColor.hex,
    active: true,
  });

  list.push({
    key: "branding",
    layerSrc: brandImg.src,
    tintHex: brandingColor.hex,
    active: true,
  });

  list.push({
    key: "leftChest",
    layerSrc: leftChestImg.src,
    uploadSrc: leftChestLogoUrl,
    active: true,
  });

  const rightLayerImg = rightLogo?.name
    ? RIGHT_LOGO_LAYER_MAP[rightLogo.name]
    : undefined;
  list.push({
    key: "rightLogo",
    layerSrc: rightLayerImg?.src ?? "",
    active: !!rightLogo && !!rightLayerImg,
  });

  list.push({
    key: "sponsorLogoFront",
    layerSrc: sponsorLogoImg.src,
    uploadSrc: sponsorLogoUrl,
    active: true,
  });

  return list;
};

// ── Jersey back overlays ──

type BuildBackOverlaysParams = {
  stripeColor: ColorOption;
  backLogoUrl?: string;
};

export const buildBackOverlays = ({
  stripeColor,
  backLogoUrl,
}: BuildBackOverlaysParams): OverlayEntry[] => {
  const list: OverlayEntry[] = [];

  list.push({
    key: "back-stripes",
    layerSrc: backStripeImgLayer.src,
    tintHex: stripeColor.hex,
    active: true,
  });

  list.push({
    key: "backSponsorLogo",
    layerSrc: backSponsorLogoImg.src,
    uploadSrc: backLogoUrl,
    active: true,
  });

  return list;
};

// ── Half Zip overlays ──

type BuildHalfZipOverlaysParams = {
  leftChestLogoUrl?: string;
  rightChestLogoUrl?: string;
};

export const buildHalfZipOverlays = ({
  leftChestLogoUrl,
  rightChestLogoUrl,
}: BuildHalfZipOverlaysParams): OverlayEntry[] => {
  const list: OverlayEntry[] = [];

  list.push({
    key: "leftChest",
    layerSrc: halfZipLeftChestLayer.src,
    uploadSrc: leftChestLogoUrl,
    active: true,
  });

  list.push({
    key: "rightChest",
    layerSrc: halfZipRightChestLayer.src,
    uploadSrc: rightChestLogoUrl,
    active: true,
  });

  return list;
};

// ── CrewNeck front overlays ──

type BuildCrewNeckFrontOverlaysParams = {
  leftChestLogoUrl?: string;
  rightChestLogoUrl?: string;
};

export const buildCrewNeckFrontOverlays = ({
  leftChestLogoUrl,
  rightChestLogoUrl,
}: BuildCrewNeckFrontOverlaysParams): OverlayEntry[] => {
  const list: OverlayEntry[] = [];

  list.push({
    key: "leftChest",
    layerSrc: crewNeckLeftChestLayer.src,
    uploadSrc: leftChestLogoUrl,
    active: true,
  });

  list.push({
    key: "rightChest",
    layerSrc: crewNeckRightChestLayer.src,
    uploadSrc: rightChestLogoUrl,
    active: true,
  });

  return list;
};

// ── CrewNeck back overlays ──

type BuildCrewNeckBackOverlaysParams = {
  backLogoUrl?: string;
};

export const buildCrewNeckBackOverlays = ({
  backLogoUrl,
}: BuildCrewNeckBackOverlaysParams): OverlayEntry[] => {
  const list: OverlayEntry[] = [];

  list.push({
    key: "backLogo",
    layerSrc: crewNeckBackLayer.src,
    uploadSrc: backLogoUrl,
    active: true,
  });

  return list;
};
