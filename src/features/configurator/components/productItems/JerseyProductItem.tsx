"use client";

import React, { useState } from "react";
import type { ColorOption, StaticLogoOption, TextConfig } from "@/types/preview";

import ColorSwatchPicker from "@/features/configurator/components/pickers/ColorSwatchPicker";
import StaticLogoPicker from "@/features/configurator/components/pickers/StaticLogoPicker";
import LogoUploadPicker from "@/features/configurator/components/pickers/LogoUploadPicker";
import TextInsertPicker from "@/features/configurator/components/pickers/TextInsertPicker";
import JerseyPreview from "@/features/configurator/components/previews/jerseyView/view/JerseyPreview";
import ProductItemLayout from "@/features/configurator/components/ProductItemLayout";

import { useCart } from "@/contexts/CartContext";
import {
  JERSEY_BACK_TEXT_OPTIONS,
  JERSEY_BG_OPTIONS,
  JERSEY_BRANDING_OPTIONS,
  JERSEY_FRONT_TEXT_OPTIONS,
  JERSEY_RIGHT_LOGO_OPTIONS,
  JERSEY_STRIPE_OPTIONS,
} from "@/lib/productCatalog";

const JerseyProductItem: React.FC<{ productName?: string }> = ({
  productName = "Jersey Design 146",
}) => {
  const { addItem, openBag } = useCart();

  const [bgColor, setBgColor] = useState<ColorOption>(JERSEY_BG_OPTIONS[0]);
  const [stripeColor, setStripeColor] = useState<ColorOption>(
    JERSEY_STRIPE_OPTIONS[0],
  );
  const [brandingColor, setBrandingColor] = useState<ColorOption>(
    JERSEY_BRANDING_OPTIONS[0],
  );

  const [leftChestLogoUrl, setLeftChestLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [rightLogo, setRightLogo] = useState<StaticLogoOption>(
    JERSEY_RIGHT_LOGO_OPTIONS[0],
  );
  const [backLogoUrl, setBackLogoUrl] = useState<string | undefined>(undefined);
  const [leftSleeveLogoUrl, setLeftSleeveLogoUrl] = useState<
    string | undefined
  >(undefined);
  const [rightSleeveLogoUrl, setRightSleeveLogoUrl] = useState<
    string | undefined
  >(undefined);
  const [backTextConfig, setBackTextConfig] = useState<TextConfig>({
    enabled: false,
    text: "",
    color: JERSEY_BACK_TEXT_OPTIONS[0],
  });
  const [frontTextConfig, setFrontTextConfig] = useState<TextConfig>({
    enabled: false,
    text: "",
    color: JERSEY_FRONT_TEXT_OPTIONS[0],
  });

  const handleAddToBagClick = () => {
    addItem({
      productType: "jersey",
      productName,
      bgColor,
      stripeColor,
      brandingColor,
      leftChestLogoUrl,
      sponsorLogoUrl,
      rightLogo,
      leftSleeveLogoUrl,
      rightSleeveLogoUrl,
      backLogoUrl,
      backTextConfig,
      frontTextConfig,
    });
    openBag();
  };

  return (
    <ProductItemLayout
      title="Jersey Design 146"
      totalDots={5}
      onAddToBag={handleAddToBagClick}
      pickers={
        <>
          <ColorSwatchPicker
            label="Main Body Colour"
            valueLabel={bgColor.name}
            options={JERSEY_BG_OPTIONS}
            selected={bgColor}
            onChange={setBgColor}
          />

          <ColorSwatchPicker
            label="Stripes Colour"
            valueLabel={stripeColor.name}
            options={JERSEY_STRIPE_OPTIONS}
            selected={stripeColor}
            onChange={setStripeColor}
          />

          <ColorSwatchPicker
            label='Branding "KCS" Colour'
            valueLabel={brandingColor.name}
            options={JERSEY_BRANDING_OPTIONS}
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
            options={JERSEY_RIGHT_LOGO_OPTIONS}
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
            colorOptions={JERSEY_FRONT_TEXT_OPTIONS}
            onChange={setFrontTextConfig}
          />

          <LogoUploadPicker
            label="Back Sponsor Logo"
            valueLabel="Sponsor logo"
            imageUrl={backLogoUrl}
            onImageChange={setBackLogoUrl}
          />

          <LogoUploadPicker
            label="Left Sleeve Logo"
            valueLabel="Custom logo"
            imageUrl={leftSleeveLogoUrl}
            onImageChange={setLeftSleeveLogoUrl}
          />

          <LogoUploadPicker
            label="Right Sleeve Logo"
            valueLabel="Custom logo"
            imageUrl={rightSleeveLogoUrl}
            onImageChange={setRightSleeveLogoUrl}
          />

          <TextInsertPicker
            label="Back Sponsor Text"
            value={backTextConfig}
            colorOptions={JERSEY_BACK_TEXT_OPTIONS}
            onChange={setBackTextConfig}
          />
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
          leftSleeveLogoUrl={leftSleeveLogoUrl}
          rightSleeveLogoUrl={rightSleeveLogoUrl}
          backLogoUrl={backLogoUrl}
          backTextConfig={backTextConfig}
        />
      }
    />
  );
};

export default JerseyProductItem;