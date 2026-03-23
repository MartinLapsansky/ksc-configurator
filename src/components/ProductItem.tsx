"use client";

import React, { useState } from "react";
import ColorSwatchPicker, { ColorOption } from './pickerComponents/ColorSwatchPicker'
import StaticLogoPicker, { StaticLogoOption } from "./pickerComponents/StaticLogoPicker";
import LogoUploadPicker from "./pickerComponents/LogoUploadPicker";
import JerseyPreview from "./productPreviewComponent/JerseyPreview";

const BG_OPTIONS: ColorOption[] = [
    { name: "Pink", hex: "#e4007f", file: "bg-hot-pink.jpg" },
    { name: "Purple", hex: "#6b2bd6", file: "bg-hot-purple.jpg" },
    { name: "Lavender", hex: "#8b7bd6", file: "bg-hot-lavender.jpg" },
    { name: "Pastel green", hex: "#7ee0b0", file: "bg-hot-pastelgreen.jpg" },
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
    { name: "Camogie", src: "/assets/camogie_logo.svg" },
    { name: "Gaa", src: "/assets/gaa_logo.png" },
    { name: "Lgfa", src: "/assets/lgfa_logo.jpg" },
];

const ProductItem: React.FC = () => {
    const [bgColor, setBgColor] = useState<ColorOption>(BG_OPTIONS[0]);

    const [stripeColor, setStripeColor] = useState<ColorOption>(
        STRIPE_OPTIONS[0],
    );

    const [brandingColor, setBrandingColor] = useState<ColorOption>(
        BRANDING_OPTIONS[0],
    );

    const [leftChestLogoUrl, setLeftChestLogoUrl] = useState<string | undefined>(
        undefined,
    );
    const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string | undefined>(
        undefined,
    );
    const [rightLogo, setRightLogo] = useState<StaticLogoOption>(
        RIGHT_LOGO_OPTIONS[0],
    );

    return (
        <div className="flex min-h-[600px] flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row">
            <aside className="w-full max-w-sm md:w-80">
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
            </aside>

            <JerseyPreview
                bgColor={bgColor}
                stripeColor={stripeColor}
                brandingColor={brandingColor}
                leftChestLogoUrl={leftChestLogoUrl}
                rightLogo={rightLogo}
                sponsorLogoUrl={sponsorLogoUrl}
            />
        </div>
    );
};

export default ProductItem;