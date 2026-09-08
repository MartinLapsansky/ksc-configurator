import type { StaticImageData } from "next/image";
import type {
  BaseColorOption,
  ColorOption,
  DoubleColorOption,
  StaticLogoOption,
  TripleColorOption,
} from "@/types/preview";

/**
 * Single source of truth for product colour/logo options. The configurator
 * pickers and the order previews both consume these arrays so the product
 * catalogue is not duplicated in two places.
 */

// ── Jersey front images ──
import bgHotPink from "@/assets/jerseys/jersey-hot-pink.png";
import bgHotPurple from "@/assets/jerseys/jersey-purple.png";
import bgHotLavender from "@/assets/jerseys/jersey-levender.png";
import bgHotPastelgreen from "@/assets/jerseys/jersey-lime-green.png";

// ── Jersey back images ──
import jerseyPurpleBack from "@/assets/jerseys/jersey-purple-back.png";
import jerseyLavenderBack from "@/assets/jerseys/jersey-levender-back.png";
import jerseyLimeGreenBack from "@/assets/jerseys/jersey-lime-green-back.png";

// ── Jersey right-logo images ──
import camogieLogo from "@/assets/camogie_logo.svg";
import gaaLogo from "@/assets/gaa_logo.png";
import lgfaLogo from "@/assets/lgfa-logo.png";

// ── Crew neck front images ──
import crewNeckBlackGraphite from "@/assets/crewnecks/front/helios_crewneck_black_graphite_gold.png";
import crewNeckBlackGraphiteRed from "@/assets/crewnecks/front/helios_crewneck_black_graphite_red.png";
import crewNeckBlackGraphiteWhite from "@/assets/crewnecks/front/helios_crewneck_black_graphite_white.png";
import crewNeckBlackGreenRed from "@/assets/crewnecks/front/helios_crewneck_black_green_red.png";
import crewNeckBlackGreenWhite from "@/assets/crewnecks/front/helios_crewneck_black_green_white.png";
import crewNeckBlackMaroonWhite from "@/assets/crewnecks/front/helios_crewneck_black_maroon_white.png";
import crewNeckNavyGreenGold from "@/assets/crewnecks/front/helios_crewneck_navy_green_gold.png";
import crewNeckNavyGreenWhite from "@/assets/crewnecks/front/helios_crewneck_navy_green_white.png";
import crewNeckNavyPurpleGold from "@/assets/crewnecks/front/helios_crewneck_navy_purple_gold.png";
import crewNeckNavyRed from "@/assets/crewnecks/front/helios_crewneck_navy_red.png";
import crewNeckNavyRoyalGold from "@/assets/crewnecks/front/helios_crewneck_navy_royal_gold.png";
import crewNeckNavyRoyalWhite from "@/assets/crewnecks/front/helios_crewneck_navy_royal_white.png";
import crewNeckNavySky from "@/assets/crewnecks/front/helios_crewneck_navy_sky.png";

// ── Crew neck back images ──
import crewNeckBlackGraphiteBack from "@/assets/crewnecks/back /helios_crewneck_black_graphite_gold_back.png";
import crewNeckBlackGraphiteRedBack from "@/assets/crewnecks/back /helios_crewneck_black_graphite_red_back.png";
import crewNeckBlackGraphiteWhiteBack from "@/assets/crewnecks/back /helios_crewneck_black_graphite_white_back.png";
import crewNeckBlackGreenRedBack from "@/assets/crewnecks/back /helios_crewneck_black_green_red_back.png";
import crewNeckBlackGreenWhiteBack from "@/assets/crewnecks/back /helios_crewneck_black_green_white_back.png";
import crewNeckBlackMaroonWhiteBack from "@/assets/crewnecks/back /helios_crewneck_black_maroon_white_back.png";
import crewNeckNavyGreenGoldBack from "@/assets/crewnecks/back /helios_crewneck_navy_green_gold_back.png";
import crewNeckNavyGreenWhiteBack from "@/assets/crewnecks/back /helios_crewneck_navy_green_white_back.png";
import crewNeckNavyPurpleGoldBack from "@/assets/crewnecks/back /helios_crewneck_navy_purple_gold_back.png";
import crewNeckNavyRedBack from "@/assets/crewnecks/back /helios_crewneck_navy_red_back.png";
import crewNeckNavyRoyalGoldBack from "@/assets/crewnecks/back /helios_crewneck_navy_royal_gold_back.png";
import crewNeckNavyRoyalWhiteBack from "@/assets/crewnecks/back /helios_crewneck_navy_royal_white_back.png";
import crewNeckNavySkyBack from "@/assets/crewnecks/back /helios_crewneck_navy_sky_back.png";

// ── Half zip front images ──
import zipBlackGraphite from "@/assets/zip-tops/zip_black_graphite.png";
import zipBlackGreen from "@/assets/zip-tops/zip_black_green.png";
import zipBlackRed from "@/assets/zip-tops/zip_black_red.png";
import zipNavyGreen from "@/assets/zip-tops/zip_navy_green.png";
import zipNavyMaroon from "@/assets/zip-tops/zip_navy_maroon.png";
import zipNavyRoyal from "@/assets/zip-tops/zip_navy_royal.png";
import zipNavySky from "@/assets/zip-tops/zip_navy_sky.png";

export const resolveSrc = (file?: StaticImageData | string): string => {
  if (!file) return "";
  return typeof file === "string" ? file : file.src;
};

/**
 * Resolves the front or back image source for the option with the given name.
 * Returns `undefined` when no option matches so callers can provide a fallback.
 */
export function findOptionSrc(
  options: BaseColorOption[],
  name: string | undefined,
  useBackFile = false,
): string | undefined {
  if (!name) return undefined;

  const option = options.find((item) => item.name === name);
  if (!option) return undefined;

  const file = useBackFile
    ? option.backFile ?? option.file
    : option.file ?? option.backFile;

  const src = resolveSrc(file);
  return src || undefined;
}

// ── Jersey ──

export const JERSEY_BG_OPTIONS: ColorOption[] = [
  {
    id: "bg-hot-pink",
    name: "Pink",
    hex: "#e4007f",
    file: bgHotPink,
    backFile: jerseyPurpleBack,
  },
  {
    id: "bg-purple",
    name: "Purple",
    hex: "#6b2bd6",
    file: bgHotPurple,
    backFile: jerseyPurpleBack,
  },
  {
    id: "bg-lavender",
    name: "Lavender",
    hex: "#8b7bd6",
    file: bgHotLavender,
    backFile: jerseyLavenderBack,
  },
  {
    id: "bg-lime-green",
    name: "Pastel green",
    hex: "#7ee0b0",
    file: bgHotPastelgreen,
    backFile: jerseyLimeGreenBack,
  },
];

export const JERSEY_DEFAULT_FRONT_SRC = resolveSrc(bgHotPurple);
export const JERSEY_DEFAULT_BACK_SRC = resolveSrc(jerseyPurpleBack);

export const JERSEY_STRIPE_OPTIONS: ColorOption[] = [
  { id: "stripe-black", name: "Black", hex: "#111111" },
  { id: "stripe-red", name: "Red", hex: "#d4002a" },
  { id: "stripe-gold", name: "Gold", hex: "#F4C531" },
  { id: "stripe-royal", name: "Royal", hex: "#0C4A9F" },
  { id: "stripe-green", name: "Green", hex: "#008937" },
];

export const JERSEY_BRANDING_OPTIONS: ColorOption[] = [
  { id: "branding-white", name: "White", hex: "#ffffff" },
  { id: "branding-black", name: "Black", hex: "#000000" },
  { id: "branding-gold", name: "Gold", hex: "#F4C531" },
  { id: "branding-royal", name: "Royal", hex: "#0C4A9F" },
];

export const JERSEY_RIGHT_LOGO_OPTIONS: StaticLogoOption[] = [
  { name: "Camogie", src: camogieLogo.src },
  { name: "Gaa", src: gaaLogo.src },
  { name: "Lgfa", src: lgfaLogo.src },
];

export const JERSEY_BACK_TEXT_OPTIONS: ColorOption[] = [
  { id: "back-text-black", name: "Black", hex: "#000000" },
  { id: "back-text-gold", name: "Gold", hex: "#F4C531" },
];

export const JERSEY_FRONT_TEXT_OPTIONS: ColorOption[] = [
  { id: "front-text-black", name: "Black", hex: "#000000" },
  { id: "front-text-gold", name: "Gold", hex: "#F4C531" },
  { id: "front-text-white", name: "White", hex: "#FFFFFF" },
];

// ── Crew neck ──

export const CREWNECK_BG_OPTIONS: TripleColorOption[] = [
  {
    id: "crewneck-black-graphite-gold",
    name: "Black / Graphite / Gold",
    hex1: "#1a1a1a",
    hex2: "#4a4a4a",
    hex3: "#F4C531",
    file: crewNeckBlackGraphite,
    backFile: crewNeckBlackGraphiteBack,
  },
  {
    id: "crewneck-black-graphite-red",
    name: "Black / Graphite / Red",
    hex1: "#1a1a1a",
    hex2: "#4a4a4a",
    hex3: "#d4002a",
    file: crewNeckBlackGraphiteRed,
    backFile: crewNeckBlackGraphiteRedBack,
  },
  {
    id: "crewneck-black-graphite-white",
    name: "Black / Graphite / White",
    hex1: "#1a1a1a",
    hex2: "#4a4a4a",
    hex3: "#ffffff",
    file: crewNeckBlackGraphiteWhite,
    backFile: crewNeckBlackGraphiteWhiteBack,
  },
  {
    id: "crewneck-black-green-red",
    name: "Black / Green / Red",
    hex1: "#1a1a1a",
    hex2: "#008937",
    hex3: "#d4002a",
    file: crewNeckBlackGreenRed,
    backFile: crewNeckBlackGreenRedBack,
  },
  {
    id: "crewneck-black-green-white",
    name: "Black / Green / White",
    hex1: "#1a1a1a",
    hex2: "#008937",
    hex3: "#ffffff",
    file: crewNeckBlackGreenWhite,
    backFile: crewNeckBlackGreenWhiteBack,
  },
  {
    id: "crewneck-black-maroon-white",
    name: "Black / Maroon / White",
    hex1: "#1a1a1a",
    hex2: "#800020",
    hex3: "#ffffff",
    file: crewNeckBlackMaroonWhite,
    backFile: crewNeckBlackMaroonWhiteBack,
  },
  {
    id: "crewneck-navy-green-gold",
    name: "Navy / Green / Gold",
    hex1: "#0C4A9F",
    hex2: "#008937",
    hex3: "#F4C531",
    file: crewNeckNavyGreenGold,
    backFile: crewNeckNavyGreenGoldBack,
  },
  {
    id: "crewneck-navy-green-white",
    name: "Navy / Green / White",
    hex1: "#0C4A9F",
    hex2: "#008937",
    hex3: "#ffffff",
    file: crewNeckNavyGreenWhite,
    backFile: crewNeckNavyGreenWhiteBack,
  },
  {
    id: "crewneck-navy-purple-gold",
    name: "Navy / Purple / Gold",
    hex1: "#0C4A9F",
    hex2: "#6b2bd6",
    hex3: "#F4C531",
    file: crewNeckNavyPurpleGold,
    backFile: crewNeckNavyPurpleGoldBack,
  },
  {
    id: "crewneck-navy-red",
    name: "Navy / Red",
    hex1: "#0C4A9F",
    hex2: "#d4002a",
    hex3: "#d4002a",
    file: crewNeckNavyRed,
    backFile: crewNeckNavyRedBack,
  },
  {
    id: "crewneck-navy-royal-gold",
    name: "Navy / Royal / Gold",
    hex1: "#0C4A9F",
    hex2: "#4169E1",
    hex3: "#F4C531",
    file: crewNeckNavyRoyalGold,
    backFile: crewNeckNavyRoyalGoldBack,
  },
  {
    id: "crewneck-navy-royal-white",
    name: "Navy / Royal / White",
    hex1: "#0C4A9F",
    hex2: "#4169E1",
    hex3: "#ffffff",
    file: crewNeckNavyRoyalWhite,
    backFile: crewNeckNavyRoyalWhiteBack,
  },
  {
    id: "crewneck-navy-sky",
    name: "Navy / Sky",
    hex1: "#0C4A9F",
    hex2: "#87CEEB",
    hex3: "#87CEEB",
    file: crewNeckNavySky,
    backFile: crewNeckNavySkyBack,
  },
];

export const CREWNECK_DEFAULT_FRONT_SRC = resolveSrc(crewNeckBlackGraphite);
export const CREWNECK_DEFAULT_BACK_SRC = resolveSrc(crewNeckBlackGraphiteBack);

// ── Half zip ──

export const HALFZIP_BG_OPTIONS: DoubleColorOption[] = [
  {
    id: "zip-black-graphite",
    name: "Black / Graphite",
    hex1: "#1a1a1a",
    hex2: "#4a4a4a",
    file: zipBlackGraphite,
  },
  {
    id: "zip-black-green",
    name: "Black / Green",
    hex1: "#1a1a1a",
    hex2: "#008937",
    file: zipBlackGreen,
  },
  {
    id: "zip-black-red",
    name: "Black / Red",
    hex1: "#1a1a1a",
    hex2: "#d4002a",
    file: zipBlackRed,
  },
  {
    id: "zip-navy-green",
    name: "Navy / Green",
    hex1: "#0C4A9F",
    hex2: "#008937",
    file: zipNavyGreen,
  },
  {
    id: "zip-navy-maroon",
    name: "Navy / Maroon",
    hex1: "#0C4A9F",
    hex2: "#800020",
    file: zipNavyMaroon,
  },
  {
    id: "zip-navy-royal",
    name: "Navy / Royal",
    hex1: "#0C4A9F",
    hex2: "#4169E1",
    file: zipNavyRoyal,
  },
  {
    id: "zip-navy-sky",
    name: "Navy / Sky",
    hex1: "#0C4A9F",
    hex2: "#87CEEB",
    file: zipNavySky,
  },
];

export const HALFZIP_DEFAULT_FRONT_SRC = resolveSrc(zipBlackGraphite);