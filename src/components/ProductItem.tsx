"use client";

import React, { useState } from "react";
import ColorSwatchPicker, { ColorOption } from './pickerComponents/ColorSwatchPicker'
import StaticLogoPicker, { StaticLogoOption } from "./pickerComponents/StaticLogoPicker";
import LogoUploadPicker from "./pickerComponents/LogoUploadPicker";
import JerseyPreview from "./productPreviewComponent/JerseyPreview";
import {BackLogoTextConfig} from "@/components/pickerComponents/TextInsertPicker";

import {useJerseyConfig} from "@/components/JerseyConfigContext";

// imports z src/app/assets
import bgHotPink from "../app/assets/bg-hot-pink.jpg";
import bgHotPurple from "../app/assets/bg-hot-purple.jpg";
import bgHotLavender from "../app/assets/bg-hot-lavender.jpg";
import bgHotPastelgreen from "../app/assets/bg-hot-pastelgreen.jpg";

import camogieLogo from "../app/assets/camogie_logo.svg";
import gaaLogo from "../app/assets/gaa_logo.png";
import lgfaLogo from "../app/assets/lgfa_logo.jpg";
import TextInsertPicker from "@/components/pickerComponents/TextInsertPicker";
import {useRouter} from "next/navigation";

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
  { name: "Gold", hex: "#F4C531" },
];
const FRONT_TEXT_OPTIONS: ColorOption[] = [
    { name: "Black", hex: "#000000" },
    { name: "Gold", hex: "#F4C531" },
]

const ProductItem: React.FC = () => {

  const {setConfig} = useJerseyConfig();
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
      <div className="flex min-h-[600px] flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row md:h-[90vh] mx-auto">

            <div className="flex flex-col">

                <h1 className="flex mb-1 text-lg text-black font-semibold">Jersey Design 146</h1>


                <aside className="w-full max-w-full md:w-100 h-[30vh] md:h-[80vh] overflow-x-auto hide-scrollbar md:overflow-x-visible hide-scrollbar">


                    <div className="h-full flex gap-4 pr-2 overflow-y-hidden md:block md:overflow-y-auto hide-scrollbar md:gap-0 hide-scrollbar">


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
                    </div>
                </aside>
            </div>


        <div className="flex flex-col w-full">
                <JerseyPreview
                    bgColor={bgColor}
                    stripeColor={stripeColor}
                    brandingColor={brandingColor}
                    leftChestLogoUrl={leftChestLogoUrl}
                    rightLogo={rightLogo}
                    sponsorLogoUrl={sponsorLogoUrl}
                    sponsorText={frontTextConfig}
                    backLogoUrl={backLogoUrl}
                    backSponsorText={backTextConfig}
                />
            <div className="flex flex-1 justify-center items-center">
                <div className="mt-3 h-15 flex md:justify-center items-center">
                    <button
                        type="button"
                        onClick={handleEnquireClick}
                        className="inline-flex items-center cursor-pointer rounded-md bg-gray-600 px-5 py-2.5 text-xl font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        Checkout
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};

export default ProductItem;