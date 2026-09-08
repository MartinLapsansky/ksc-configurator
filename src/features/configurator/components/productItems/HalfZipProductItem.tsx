"use client";

import React, { useState } from "react";
import type { DoubleColorOption } from "@/types/preview";

import DoubleColorSwatchPicker from "@/features/configurator/components/pickers/DoubleColorSwatchPicker";
import LogoUploadPicker from "@/features/configurator/components/pickers/LogoUploadPicker";
import HalfZipPreview from "@/features/configurator/components/previews/halfZipView/view/HalfZipPreview";
import ProductItemLayout from "@/features/configurator/components/ProductItemLayout";

import { useCart } from "@/contexts/CartContext";
import { HALFZIP_BG_OPTIONS } from "@/lib/productCatalog";

const HalfZipProductItem: React.FC<{ productName?: string }> = ({
  productName = "Soul Half Zip",
}) => {
  const { addItem, openBag } = useCart();

  const [bgColor, setBgColor] = useState<DoubleColorOption>(
    HALFZIP_BG_OPTIONS[0],
  );

  const [leftChestLogoUrl, setLeftChestLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [rightChestLogoUrl, setRightChestLogoUrl] = useState<
    string | undefined
  >(undefined);

  const handleAddToBagClick = () => {
    addItem({
      productType: "halfZip",
      productName,
      bgColor,
      leftChestLogoUrl,
      rightChestLogoUrl,
    });

    openBag();
  };

  return (
    <ProductItemLayout
      title="Half Zip"
      totalDots={3}
      onAddToBag={handleAddToBagClick}
      pickers={
        <>
          <DoubleColorSwatchPicker
            label="Main Body Colour"
            valueLabel={bgColor.name}
            options={HALFZIP_BG_OPTIONS}
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
        </>
      }
      preview={
        <HalfZipPreview
          bgColor={bgColor}
          leftChestLogoUrl={leftChestLogoUrl}
          rightChestLogoUrl={rightChestLogoUrl}
        />
      }
    />
  );
};

export default HalfZipProductItem;