"use client";

import React, {useEffect, useRef, useState} from "react";
import DoubleColorSwatchPicker from '../../pickerComponents/DoubleColorSwatchPicker'
import {DoubleColorOption} from "@/types/preview";
import LogoUploadPicker from "../../pickerComponents/LogoUploadPicker";
import HalfZipPreview from "@/components/productPreviewComponents/halfZipView/view/HalfZipPreview";
import {useProductConfig} from "@/app/contexts/ProductConfigContext";
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

const HalfZipProductItem: React.FC = () => {

  const {setConfig} = useProductConfig();
  const router = useRouter();

  const [bgColor, setBgColor] = useState<DoubleColorOption>(BG_OPTIONS[0]);

  const [leftChestLogoUrl, setLeftChestLogoUrl] = useState<string | undefined>(
    undefined,
  );
  const [rightChestLogoUrl, setRightChestLogoUrl] = useState<string | undefined>(
    undefined,
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalDots = 3;

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
            productType: "halfZip",
            bgColor,
            leftChestLogoUrl,
            rightChestLogoUrl,
        });

        router.push("/enquire");
    };

  return (
      <div className="flex min-h-[600px] flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row md:h-[90vh] mx-auto">

            <div className="flex flex-col">

                <h1 className="flex mb-1 text-lg text-black font-semibold">Half Zip Hoodie</h1>


                <aside className="w-full max-w-full md:w-100 h-[30vh] md:h-[80vh] overflow-x-auto hide-scrollbar md:overflow-x-visible hide-scrollbar">


                    <div ref={scrollRef} className="h-full flex gap-4 pr-2 overflow-y-hidden md:block md:overflow-y-auto hide-scrollbar md:gap-0 hide-scrollbar">


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
                <HalfZipPreview
                    bgColor={bgColor}
                    leftChestLogoUrl={leftChestLogoUrl}
                    rightChestLogoUrl={rightChestLogoUrl}
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

export default HalfZipProductItem;
