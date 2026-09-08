"use client";

import React, { useState } from "react";
import type { TripleColorOption } from "@/types/preview";

import TripleColorSwatchPicker from "@/features/configurator/components/pickers/TripleColorSwatchPicker";
import LogoUploadPicker from "@/features/configurator/components/pickers/LogoUploadPicker";
import CrewNeckPreview from "@/features/configurator/components/previews/crewNeckView/view/CrewNeckPreview";
import ProductItemLayout from "@/features/configurator/components/ProductItemLayout";

import { useCart } from "@/contexts/CartContext";
import { CREWNECK_BG_OPTIONS } from "@/lib/productCatalog";

const CrewNeckProductItem: React.FC<{ productName?: string }> = ({
  productName = "Helios Crew Neck",
}) => {
  const { addItem, openBag } = useCart();

  const [bgColor, setBgColor] = useState<TripleColorOption>(
    CREWNECK_BG_OPTIONS[0],
  );

  const [leftChestLogoUrl, setLeftChestLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [rightChestLogoUrl, setRightChestLogoUrl] = useState<
    string | undefined
  >(undefined);
  const [backLogoUrl, setBackLogoUrl] = useState<string | undefined>(undefined);

  const handleAddToBagClick = () => {
    addItem({
      productType: "crewNeck",
      productName,
      bgColor,
      leftChestLogoUrl,
      rightChestLogoUrl,
      backLogoUrl,
    });

    openBag();
  };

  return (
    <ProductItemLayout
      title="Crew Neck"
      totalDots={4}
      onAddToBag={handleAddToBagClick}
      pickers={
        <>
          <TripleColorSwatchPicker
            label="Main Body Colour"
            valueLabel={bgColor.name}
            options={CREWNECK_BG_OPTIONS}
            selected={bgColor}
            onChange={setBgColor}
          />

          <LogoUploadPicker
            label="Left Chest Logo"
            valueLabel="Custom logo"
            imageUrl={leftChestLogoUrl}
            onImageChange={setLeftChestLogoUrl}
          />

          <LogoUploadPicker
            label="Right Chest Logo"
            valueLabel="Custom logo"
            imageUrl={rightChestLogoUrl}
            onImageChange={setRightChestLogoUrl}
          />

          <LogoUploadPicker
            label="Back Logo"
            valueLabel="Custom logo"
            imageUrl={backLogoUrl}
            onImageChange={setBackLogoUrl}
          />
        </>
      }
      preview={
        <CrewNeckPreview
          bgColor={bgColor}
          leftChestLogoUrl={leftChestLogoUrl}
          rightChestLogoUrl={rightChestLogoUrl}
          backLogoUrl={backLogoUrl}
        />
      }
    />
  );
};

export default CrewNeckProductItem;