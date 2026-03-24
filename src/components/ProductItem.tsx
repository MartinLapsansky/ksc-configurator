"use client";

import React, { useState } from "react";
import ColorSwatchPicker, { ColorOption } from './pickerComponents/ColorSwatchPicker'
import StaticLogoPicker, { StaticLogoOption } from "./pickerComponents/StaticLogoPicker";
import LogoUploadPicker from "./pickerComponents/LogoUploadPicker";
import JerseyPreview from "./productPreviewComponent/JerseyPreview";
import {BackLogoTextConfig} from "@/components/pickerComponents/TextInsertPicker";

// imports z src/app/assets
import bgHotPink from "../app/assets/bg-hot-pink.jpg";
import bgHotPurple from "../app/assets/bg-hot-purple.jpg";
import bgHotLavender from "../app/assets/bg-hot-lavender.jpg";
import bgHotPastelgreen from "../app/assets/bg-hot-pastelgreen.jpg";

import camogieLogo from "../app/assets/camogie_logo.svg";
import gaaLogo from "../app/assets/gaa_logo.png";
import lgfaLogo from "../app/assets/lgfa_logo.jpg";
import TextInsertPicker from "@/components/pickerComponents/TextInsertPicker";

const BG_OPTIONS: ColorOption[] = [
  { name: "Pink", hex: "#e4007f", file: bgHotPink },
  { name: "Purple", hex: "#6b2bd6", file: bgHotPurple },
  { name: "Lavender", hex: "#8b7bd6", file: bgHotLavender },
  { name: "Pastel green", hex: "#7ee0b0", file: bgHotPastelgreen },
];

const STRIPE_OPTIONS: ColorOption[] = [
  { name: "Black", hex: "#111111" },
  { name: "Red", hex: "#d4002a" },
  { name: "Gold", hex: "#F4C531" },
  { name: "Royal", hex: "#0C4A9F" },
  { name: "Green", hex: "#008937" },
];

const BRANDING_OPTIONS: ColorOption[] = [
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#000000" },
  { name: "Gold", hex: "#F4C531" },
  { name: "Royal", hex: "#0C4A9F" },
];

const RIGHT_LOGO_OPTIONS: StaticLogoOption[] = [
  { name: "Camogie", src: camogieLogo.src },
  { name: "Gaa", src: gaaLogo.src },
  { name: "Lgfa", src: lgfaLogo.src },
];
const BACK_TEXT_OPTIONS: ColorOption[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
];

const ProductItem: React.FC = () => {
  const [bgColor, setBgColor] = useState<ColorOption>(BG_OPTIONS[0]);
  const [stripeColor, setStripeColor] = useState<ColorOption>(STRIPE_OPTIONS[0]);
  const [brandingColor, setBrandingColor] =
    useState<ColorOption>(BRANDING_OPTIONS[0]);

  const [leftChestLogoUrl, setLeftChestLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [rightLogo, setRightLogo] = useState<StaticLogoOption>(
    RIGHT_LOGO_OPTIONS[0],
  );
  const [backLogoUrl, setBackLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [backTextConfig, setBackTextConfig] = useState<BackLogoTextConfig>({
    enabled: false,
    text: "",
    color: BACK_TEXT_OPTIONS[0],
  });

  return (
    <div className="flex min-h-[600px] flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row w-screen h-screen mx-auto">
      <aside className="w-full max-w-sm md:w-100">
        <h1 className="mb-1 text-lg font-semibold">Jersey Design 146</h1>
        <p className="mb-4 text-xs text-gray-500">
          Preview: jersey base + stripes overlay + logos
        </p>

        <ColorSwatchPicker
          label="Main Body Colour"
          valueLabel={bgColor.name}
          options={BG_OPTIONS}
          selected={bgColor}
          onChange={setBgColor}
        />

        <ColorSwatchPicker
          label="Stripes Colour"
          valueLabel={stripeColor.name}
          options={STRIPE_OPTIONS}
          selected={stripeColor}
          onChange={setStripeColor}
        />

        <ColorSwatchPicker
          label='Branding "KSC" Colour'
          valueLabel={brandingColor.name}
          options={BRANDING_OPTIONS}
          selected={brandingColor}
          onChange={setBrandingColor}
        />

        <LogoUploadPicker
          label="Left Chest Logo"
          valueLabel="Custom logo"
          imageUrl={leftChestLogoUrl}
          onImageChange={setLeftChestLogoUrl}
        />

        <StaticLogoPicker
          label="Right Chest Logo"
          options={RIGHT_LOGO_OPTIONS}
          selected={rightLogo}
          onChange={setRightLogo}
        />

        <LogoUploadPicker
          label="Front Sponsor Logo"
          valueLabel="Sponsor logo"
          imageUrl={sponsorLogoUrl}
          onImageChange={setSponsorLogoUrl}
        />

          <LogoUploadPicker
              label="Front Sponsor Logo"
              valueLabel="Sponsor logo"
              imageUrl={backLogoUrl}
              onImageChange={setBackLogoUrl}
          />

          <TextInsertPicker label="Back Sponsor Text" value={backTextConfig} colorOptions={BACK_TEXT_OPTIONS} onChange={setBackTextConfig}/>
      </aside>

      <JerseyPreview
        bgColor={bgColor}
        stripeColor={stripeColor}
        brandingColor={brandingColor}
        leftChestLogoUrl={leftChestLogoUrl}
        rightLogo={rightLogo}
        sponsorLogoUrl={sponsorLogoUrl}
        backLogoUrl={backLogoUrl}
        backSponsorText={backTextConfig}
      />
    </div>
  );
};

export default ProductItem;