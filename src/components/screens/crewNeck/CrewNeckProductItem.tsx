"use client";

import React, { useState } from "react";
import TripleColorSwatchPicker from '../../pickerComponents/TripleColorSwatchPicker'
import {TripleColorOption} from "@/types/preview";
import LogoUploadPicker from "../../pickerComponents/LogoUploadPicker";
import CrewNeckPreview from "@/components/productPreviewComponents/crewNeckView/view/CrewNeckPreview";
import ProductItemLayout from "../ProductItemLayout";
import {useProductConfig} from "@/app/contexts/ProductConfigContext";
import {useRouter} from "next/navigation";

// imports z src/app/assets/crewnecks/front
import crewNeckBlackGraphite from "../../../app/assets/crewnecks/front/helios_crewneck_black_graphite_gold.png";
import crewNeckBlackGraphiteRed from "../../../app/assets/crewnecks/front/helios_crewneck_black_graphite_red.png";
import crewNeckBlackGraphiteWhite from "../../../app/assets/crewnecks/front/helios_crewneck_black_graphite_white.png";
import crewNeckBlackGreenRed from "../../../app/assets/crewnecks/front/helios_crewneck_black_green_red.png";
import crewNeckBlackGreenWhite from "../../../app/assets/crewnecks/front/helios_crewneck_black_green_white.png";
import crewNeckBlackMaroonWhite from "../../../app/assets/crewnecks/front/helios_crewneck_black_maroon_white.png";
import crewNeckNavyGreenGold from "../../../app/assets/crewnecks/front/helios_crewneck_navy_green_gold.png";
import crewNeckNavyGreenWhite from "../../../app/assets/crewnecks/front/helios_crewneck_navy_green_white.png";
import crewNeckNavyPurpleGold from "../../../app/assets/crewnecks/front/helios_crewneck_navy_purple_gold.png";
import crewNeckNavyRed from "../../../app/assets/crewnecks/front/helios_crewneck_navy_red.png";
import crewNeckNavyRoyalGold from "../../../app/assets/crewnecks/front/helios_crewneck_navy_royal_gold.png";
import crewNeckNavyRoyalWhite from "../../../app/assets/crewnecks/front/helios_crewneck_navy_royal_white.png";
import crewNeckNavySky from "../../../app/assets/crewnecks/front/helios_crewneck_navy_sky.png";

// imports z src/app/assets/crewnecks/back
import crewNeckBlackGraphiteBack from "../../../app/assets/crewnecks/back /helios_crewneck_black_graphite_gold_back.png";
import crewNeckBlackGraphiteRedBack from "../../../app/assets/crewnecks/back /helios_crewneck_black_graphite_red_back.png";
import crewNeckBlackGraphiteWhiteBack from "../../../app/assets/crewnecks/back /helios_crewneck_black_graphite_white_back.png";
import crewNeckBlackGreenRedBack from "../../../app/assets/crewnecks/back /helios_crewneck_black_green_red_back.png";
import crewNeckBlackGreenWhiteBack from "../../../app/assets/crewnecks/back /helios_crewneck_black_green_white_back.png";
import crewNeckBlackMaroonWhiteBack from "../../../app/assets/crewnecks/back /helios_crewneck_black_maroon_white_back.png";
import crewNeckNavyGreenGoldBack from "../../../app/assets/crewnecks/back /helios_crewneck_navy_green_gold_back.png";
import crewNeckNavyGreenWhiteBack from "../../../app/assets/crewnecks/back /helios_crewneck_navy_green_white_back.png";
import crewNeckNavyPurpleGoldBack from "../../../app/assets/crewnecks/back /helios_crewneck_navy_purple_gold_back.png";
import crewNeckNavyRedBack from "../../../app/assets/crewnecks/back /helios_crewneck_navy_red_back.png";
import crewNeckNavyRoyalGoldBack from "../../../app/assets/crewnecks/back /helios_crewneck_navy_royal_gold_back.png";
import crewNeckNavyRoyalWhiteBack from "../../../app/assets/crewnecks/back /helios_crewneck_navy_royal_white_back.png";
import crewNeckNavySkyBack from "../../../app/assets/crewnecks/back /helios_crewneck_navy_sky_back.png";


const BG_OPTIONS: TripleColorOption[] = [
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


const CrewNeckProductItem: React.FC = () => {

  const {setConfig} = useProductConfig();
  const router = useRouter();

  const [bgColor, setBgColor] = useState<TripleColorOption>(BG_OPTIONS[0]);

  const [leftChestLogoUrl, setLeftChestLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [rightChestLogoUrl, setRightChestLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [backLogoUrl, setBackLogoUrl] = useState<string | undefined>(
    undefined,
  );

    const handleEnquireClick = () => {
        setConfig({
            productType: "crewNeck",
            bgColor,
            leftChestLogoUrl,
            rightChestLogoUrl,
            backLogoUrl,
        });

        router.push("/enquire");
    };

  return (
    <ProductItemLayout
      title="Helios Crew Neck"
      totalDots={4}
      onEnquire={handleEnquireClick}
      pickers={
        <>
          <TripleColorSwatchPicker
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
