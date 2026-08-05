"use client";

import React, { useState } from "react";
import ColorSwatchPicker from '../../pickerComponents/ColorSwatchPicker'
import {ColorOption} from "@/types/preview";
import StaticLogoPicker, { StaticLogoOption } from "../../pickerComponents/StaticLogoPicker";
import LogoUploadPicker from "../../pickerComponents/LogoUploadPicker";
import JerseyPreview from "@/components/productPreviewComponents/jerseyView/view/JerseyPreview";
import ProductItemLayout from "../ProductItemLayout";
import {BackLogoTextConfig} from "@/components/pickerComponents/TextInsertPicker";

import {useProductConfig} from "@/app/contexts/ProductConfigContext";

// imports z src/app/assets
import bgHotPink from "../../../app/assets/jerseys/jersey-hot-pink.png";
import bgHotPurple from "../../../app/assets/jerseys/jersey-purple.png";
import bgHotLavender from "../../../app/assets/jerseys/jersey-levender.png";
import bgHotPastelgreen from "../../../app/assets/jerseys/jersey-lime-green.png";

// import for back jerseys
import jerseyPurpleBack from "@/app/assets/jerseys/jersey-purple-back.png";
import jerseyLavenderBack from "@/app/assets/jerseys/jersey-levender-back.png";
import jerseyLimeGreenBack from "@/app/assets/jerseys/jersey-lime-green-back.png";

import camogieLogo from "../../../app/assets/camogie_logo.svg";
import gaaLogo from "../../../app/assets/gaa_logo.png";
import lgfaLogo from "../../../app/assets/lgfa-logo.png";
import TextInsertPicker from "@/components/pickerComponents/TextInsertPicker";
import {useRouter} from "next/navigation";

const BG_OPTIONS: ColorOption[] = [
    {
        id: "bg-hot-pink",
        name: "Pink",
        hex: "#e4007f",
        file: bgHotPink,            // front jersey image
        backFile: jerseyPurpleBack, // back jersey image
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

const STRIPE_OPTIONS: ColorOption[] = [
    { id: "stripe-black", name: "Black", hex: "#111111" },
    { id: "stripe-red", name: "Red", hex: "#d4002a" },
    { id: "stripe-gold", name: "Gold", hex: "#F4C531" },
    { id: "stripe-royal", name: "Royal", hex: "#0C4A9F" },
    { id: "stripe-green", name: "Green", hex: "#008937" },
];

const BRANDING_OPTIONS: ColorOption[] = [
    { id: "branding-white", name: "White", hex: "#ffffff" },
    { id: "branding-black", name: "Black", hex: "#000000" },
    { id: "branding-gold", name: "Gold", hex: "#F4C531" },
    { id: "branding-royal", name: "Royal", hex: "#0C4A9F" },
];

const RIGHT_LOGO_OPTIONS: StaticLogoOption[] = [
  { name: "Camogie", src: camogieLogo.src },
  { name: "Gaa", src: gaaLogo.src },
  { name: "Lgfa", src: lgfaLogo.src },
];
const BACK_TEXT_OPTIONS: ColorOption[] = [
    { id: "back-text-black", name: "Black", hex: "#000000" },
    { id: "back-text-gold", name: "Gold", hex: "#F4C531" },
];
const FRONT_TEXT_OPTIONS: ColorOption[] = [
    { id: "front-text-black", name: "Black", hex: "#000000" },
    { id: "front-text-gold", name: "Gold", hex: "#F4C531" },
    { id: "front-text-white", name: "White", hex: "#FFFFFF" },
];

const JerseyProductItem: React.FC = () => {

  const {setConfig} = useProductConfig();

  const router = useRouter();

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

  const [frontTextConfig, setFrontTextConfig] = useState<BackLogoTextConfig>({
      enabled: false,
      text: "",
      color: FRONT_TEXT_OPTIONS[0]
  });

    const handleEnquireClick = () => {
        setConfig({
            productType: "jersey",
            bgColor,
            stripeColor,
            brandingColor,
            leftChestLogoUrl,
            sponsorLogoUrl,
            rightLogo,
            backLogoUrl,
            backTextConfig,
            frontTextConfig,
        });

        router.push("/enquire");
    };

  return (
    <ProductItemLayout
      title="Jersey Design 146"
      totalDots={5}
      onEnquire={handleEnquireClick}
      pickers={
        <>
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
            label='Branding "KCS" Colour'
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

          <TextInsertPicker
            label="Front Sponsor Text"
            value={frontTextConfig}
            colorOptions={FRONT_TEXT_OPTIONS}
            onChange={setFrontTextConfig}/>

          <LogoUploadPicker
            label="Back Sponsor Logo"
            valueLabel="Sponsor logo"
            imageUrl={backLogoUrl}
            onImageChange={setBackLogoUrl}
          />

          <TextInsertPicker
            label="Back Sponsor Text"
            value={backTextConfig}
            colorOptions={BACK_TEXT_OPTIONS}
            onChange={setBackTextConfig}/>
        </>
      }
      preview={
        <JerseyPreview
          bgColor={bgColor}
          stripeColor={stripeColor}
          brandingColor={brandingColor}
          leftChestLogoUrl={leftChestLogoUrl}
          rightLogo={rightLogo}
          sponsorLogoUrl={sponsorLogoUrl}
          sponsorText={frontTextConfig}
          backLogoUrl={backLogoUrl}
          backTextConfig={backTextConfig}
        />
      }
    />
  );
};

export default JerseyProductItem;
