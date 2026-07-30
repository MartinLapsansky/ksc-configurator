"use client";

import React, {useEffect, useRef, useState} from "react";
import TripleColorSwatchPicker from '../../pickerComponents/TripleColorSwatchPicker'
import {TripleColorOption} from "@/types/preview";
import LogoUploadPicker from "../../pickerComponents/LogoUploadPicker";
import CrewNeckPreview from "@/components/productPreviewComponents/crewNeckView/view/CrewNeckPreview";
import {useProductConfig} from "@/app/contexts/ProductConfigContext";
import {useRouter} from "next/navigation";

// imports z src/app/assets/crewnecks
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

const BG_OPTIONS: TripleColorOption[] = [
    {
        id: "crewneck-black-graphite-gold",
        name: "Black / Graphite / Gold",
        hex1: "#1a1a1a",
        hex2: "#4a4a4a",
        hex3: "#F4C531",
        file: crewNeckBlackGraphite,
    },
    {
        id: "crewneck-black-graphite-red",
        name: "Black / Graphite / Red",
        hex1: "#1a1a1a",
        hex2: "#4a4a4a",
        hex3: "#d4002a",
        file: crewNeckBlackGraphiteRed,
    },
    {
        id: "crewneck-black-graphite-white",
        name: "Black / Graphite / White",
        hex1: "#1a1a1a",
        hex2: "#4a4a4a",
        hex3: "#ffffff",
        file: crewNeckBlackGraphiteWhite,
    },
    {
        id: "crewneck-black-green-red",
        name: "Black / Green / Red",
        hex1: "#1a1a1a",
        hex2: "#008937",
        hex3: "#d4002a",
        file: crewNeckBlackGreenRed,
    },
    {
        id: "crewneck-black-green-white",
        name: "Black / Green / White",
        hex1: "#1a1a1a",
        hex2: "#008937",
        hex3: "#ffffff",
        file: crewNeckBlackGreenWhite,
    },
    {
        id: "crewneck-black-maroon-white",
        name: "Black / Maroon / White",
        hex1: "#1a1a1a",
        hex2: "#800020",
        hex3: "#ffffff",
        file: crewNeckBlackMaroonWhite,
    },
    {
        id: "crewneck-navy-green-gold",
        name: "Navy / Green / Gold",
        hex1: "#0C4A9F",
        hex2: "#008937",
        hex3: "#F4C531",
        file: crewNeckNavyGreenGold,
    },
    {
        id: "crewneck-navy-green-white",
        name: "Navy / Green / White",
        hex1: "#0C4A9F",
        hex2: "#008937",
        hex3: "#ffffff",
        file: crewNeckNavyGreenWhite,
    },
    {
        id: "crewneck-navy-purple-gold",
        name: "Navy / Purple / Gold",
        hex1: "#0C4A9F",
        hex2: "#6b2bd6",
        hex3: "#F4C531",
        file: crewNeckNavyPurpleGold,
    },
    {
        id: "crewneck-navy-red",
        name: "Navy / Red",
        hex1: "#0C4A9F",
        hex2: "#d4002a",
        hex3: "#d4002a",
        file: crewNeckNavyRed,
    },
    {
        id: "crewneck-navy-royal-gold",
        name: "Navy / Royal / Gold",
        hex1: "#0C4A9F",
        hex2: "#4169E1",
        hex3: "#F4C531",
        file: crewNeckNavyRoyalGold,
    },
    {
        id: "crewneck-navy-royal-white",
        name: "Navy / Royal / White",
        hex1: "#0C4A9F",
        hex2: "#4169E1",
        hex3: "#ffffff",
        file: crewNeckNavyRoyalWhite,
    },
    {
        id: "crewneck-navy-sky",
        name: "Navy / Sky",
        hex1: "#0C4A9F",
        hex2: "#87CEEB",
        hex3: "#87CEEB",
        file: crewNeckNavySky,
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

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalDots = 4;

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const scrollLeft = el.scrollLeft;
            const maxScroll = el.scrollWidth - el.clientWidth;

            if (maxScroll <= 0) {
                setActiveIndex(0);
                return;
            }

            const progress = scrollLeft / maxScroll;
            const index = Math.round(progress * (totalDots - 1));
            setActiveIndex(index);
        };

        el.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

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
      <div className="flex min-h-[600px] flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row md:h-[90vh] mx-auto">

            <div className="flex flex-col">

                <h1 className="flex mb-1 text-lg text-black font-semibold">Helios Crew Neck</h1>


                <aside className="w-full max-w-full md:w-100 h-[30vh] md:h-[80vh] overflow-x-auto hide-scrollbar md:overflow-x-visible hide-scrollbar">


                    <div ref={scrollRef} className="h-full flex gap-4 pr-2 overflow-y-hidden md:block md:overflow-y-auto hide-scrollbar md:gap-0 hide-scrollbar">


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

                    </div>


                </aside>

                {/* Pagination dots - only for mobile */}
                <div className="mt-3 flex justify-center gap-2 md:hidden">
                    {Array.from({ length: totalDots }).map((_, i) => (
                        <span
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all ${
                                i === activeIndex ? "bg-gray-800 scale-110" : "bg-gray-300"
                            }`}
                        />
                    ))}
                </div>
            </div>


        <div className="flex flex-col w-full">
                <CrewNeckPreview
                    bgColor={bgColor}
                    leftChestLogoUrl={leftChestLogoUrl}
                    rightChestLogoUrl={rightChestLogoUrl}
                    backLogoUrl={backLogoUrl}
                />
            <div className="flex flex-1 justify-center items-center">
                <div className="mt-3 h-15 flex md:justify-center items-center">
                    <button
                        type="button"
                        onClick={handleEnquireClick}
                        className="inline-flex items-center cursor-pointer rounded-md bg-black px-5 py-2.5 text-xl font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        Enquire
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};

export default CrewNeckProductItem;
