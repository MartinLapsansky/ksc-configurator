"use client";

import React, { useState } from "react";
import DoubleColorSwatchPicker from '../../pickerComponents/DoubleColorSwatchPicker'
import {DoubleColorOption} from "@/types/preview";
import LogoUploadPicker from "../../pickerComponents/LogoUploadPicker";
import HalfZipPreview from "@/components/productPreviewComponents/halfZipView/view/HalfZipPreview";
import ProductItemLayout from "../ProductItemLayout";
import {useCart} from "@/app/contexts/CartContext";
import {useRouter} from "next/navigation";

// imports z src/app/assets/zip-tops
import zipBlackGraphite from "../../../app/assets/zip-tops/zip_black_graphite.png";
import zipBlackGreen from "../../../app/assets/zip-tops/zip_black_green.png";
import zipBlackRed from "../../../app/assets/zip-tops/zip_black_red.png";
import zipNavyGreen from "../../../app/assets/zip-tops/zip_navy_green.png";
import zipNavyMaroon from "../../../app/assets/zip-tops/zip_navy_maroon.png";
import zipNavyRoyal from "../../../app/assets/zip-tops/zip_navy_royal.png";
import zipNavySky from "../../../app/assets/zip-tops/zip_navy_sky.png";

const BG_OPTIONS: DoubleColorOption[] = [
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

const HalfZipProductItem: React.FC<{ productName?: string }> = ({
  productName = "Soul Half Zip",
}) => {
  const {addItem} = useCart();
  const router = useRouter();

  const [bgColor, setBgColor] = useState<DoubleColorOption>(BG_OPTIONS[0]);

  const [leftChestLogoUrl, setLeftChestLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [rightChestLogoUrl, setRightChestLogoUrl] = useState<string | undefined>(
    undefined,
  );

    const handleAddToBagClick = () => {
        addItem({
            productType: "halfZip",
            productName,
            bgColor,
            leftChestLogoUrl,
            rightChestLogoUrl,
        });

        router.push("/checkout");
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
            options={BG_OPTIONS}
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
