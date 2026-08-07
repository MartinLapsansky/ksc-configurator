"use client";

import React, { useMemo, useState } from "react";
import type { ProductConfig } from "@/types/preview";
import { ProductCanvas } from "@/app/contexts/ProductCanvasContext";
import { buildCrewNeckFrontOverlays, buildCrewNeckBackOverlays } from "../../productPreviewComponents/utils/buildOverlays";

import crewNeckBlackGraphite from "@/app/assets/crewnecks/front/helios_crewneck_black_graphite_gold.png";
import crewNeckBlackGraphiteRed from "@/app/assets/crewnecks/front/helios_crewneck_black_graphite_red.png";
import crewNeckBlackGraphiteWhite from "@/app/assets/crewnecks/front/helios_crewneck_black_graphite_white.png";
import crewNeckBlackGreenRed from "@/app/assets/crewnecks/front/helios_crewneck_black_green_red.png";
import crewNeckBlackGreenWhite from "@/app/assets/crewnecks/front/helios_crewneck_black_green_white.png";
import crewNeckBlackMaroonWhite from "@/app/assets/crewnecks/front/helios_crewneck_black_maroon_white.png";
import crewNeckNavyGreenGold from "@/app/assets/crewnecks/front/helios_crewneck_navy_green_gold.png";
import crewNeckNavyGreenWhite from "@/app/assets/crewnecks/front/helios_crewneck_navy_green_white.png";
import crewNeckNavyPurpleGold from "@/app/assets/crewnecks/front/helios_crewneck_navy_purple_gold.png";
import crewNeckNavyRed from "@/app/assets/crewnecks/front/helios_crewneck_navy_red.png";
import crewNeckNavyRoyalGold from "@/app/assets/crewnecks/front/helios_crewneck_navy_royal_gold.png";
import crewNeckNavyRoyalWhite from "@/app/assets/crewnecks/front/helios_crewneck_navy_royal_white.png";
import crewNeckNavySky from "@/app/assets/crewnecks/front/helios_crewneck_navy_sky.png";

import crewNeckBlackGraphiteBack from "@/app/assets/crewnecks/back /helios_crewneck_black_graphite_gold_back.png";
import crewNeckBlackGraphiteRedBack from "@/app/assets/crewnecks/back /helios_crewneck_black_graphite_red_back.png";
import crewNeckBlackGraphiteWhiteBack from "@/app/assets/crewnecks/back /helios_crewneck_black_graphite_white_back.png";
import crewNeckBlackGreenRedBack from "@/app/assets/crewnecks/back /helios_crewneck_black_green_red_back.png";
import crewNeckBlackGreenWhiteBack from "@/app/assets/crewnecks/back /helios_crewneck_black_green_white_back.png";
import crewNeckBlackMaroonWhiteBack from "@/app/assets/crewnecks/back /helios_crewneck_black_maroon_white_back.png";
import crewNeckNavyGreenGoldBack from "@/app/assets/crewnecks/back /helios_crewneck_navy_green_gold_back.png";
import crewNeckNavyGreenWhiteBack from "@/app/assets/crewnecks/back /helios_crewneck_navy_green_white_back.png";
import crewNeckNavyPurpleGoldBack from "@/app/assets/crewnecks/back /helios_crewneck_navy_purple_gold_back.png";
import crewNeckNavyRedBack from "@/app/assets/crewnecks/back /helios_crewneck_navy_red_back.png";
import crewNeckNavyRoyalGoldBack from "@/app/assets/crewnecks/back /helios_crewneck_navy_royal_gold_back.png";
import crewNeckNavyRoyalWhiteBack from "@/app/assets/crewnecks/back /helios_crewneck_navy_royal_white_back.png";
import crewNeckNavySkyBack from "@/app/assets/crewnecks/back /helios_crewneck_navy_sky_back.png";

const BASE_CREWNECK_BY_NAME: Record<string, string> = {
  "Black / Graphite / Gold": crewNeckBlackGraphite.src,
  "Black / Graphite / Red": crewNeckBlackGraphiteRed.src,
  "Black / Graphite / White": crewNeckBlackGraphiteWhite.src,
  "Black / Green / Red": crewNeckBlackGreenRed.src,
  "Black / Green / White": crewNeckBlackGreenWhite.src,
  "Black / Maroon / White": crewNeckBlackMaroonWhite.src,
  "Navy / Green / Gold": crewNeckNavyGreenGold.src,
  "Navy / Green / White": crewNeckNavyGreenWhite.src,
  "Navy / Purple / Gold": crewNeckNavyPurpleGold.src,
  "Navy / Red": crewNeckNavyRed.src,
  "Navy / Royal / Gold": crewNeckNavyRoyalGold.src,
  "Navy / Royal / White": crewNeckNavyRoyalWhite.src,
  "Navy / Sky": crewNeckNavySky.src,
};

const BACK_CREWNECK_BY_NAME: Record<string, string> = {
  "Black / Graphite / Gold": crewNeckBlackGraphiteBack.src,
  "Black / Graphite / Red": crewNeckBlackGraphiteRedBack.src,
  "Black / Graphite / White": crewNeckBlackGraphiteWhiteBack.src,
  "Black / Green / Red": crewNeckBlackGreenRedBack.src,
  "Black / Green / White": crewNeckBlackGreenWhiteBack.src,
  "Black / Maroon / White": crewNeckBlackMaroonWhiteBack.src,
  "Navy / Green / Gold": crewNeckNavyGreenGoldBack.src,
  "Navy / Green / White": crewNeckNavyGreenWhiteBack.src,
  "Navy / Purple / Gold": crewNeckNavyPurpleGoldBack.src,
  "Navy / Red": crewNeckNavyRedBack.src,
  "Navy / Royal / Gold": crewNeckNavyRoyalGoldBack.src,
  "Navy / Royal / White": crewNeckNavyRoyalWhiteBack.src,
  "Navy / Sky": crewNeckNavySkyBack.src,
};

type CrewNeckPreviewOrderProps = {
  productConfig: ProductConfig;
};

export default function CrewNeckPreviewOrder({ productConfig }: CrewNeckPreviewOrderProps) {
  const [isBackView, setIsBackView] = useState(false);

  const baseCrewNeckSrc = useMemo(() => {
    const name = productConfig.bgColor?.name;
    if (isBackView) {
      return name ? BACK_CREWNECK_BY_NAME[name] ?? crewNeckBlackGraphiteBack.src : crewNeckBlackGraphiteBack.src;
    }
    return name ? BASE_CREWNECK_BY_NAME[name] ?? crewNeckBlackGraphite.src : crewNeckBlackGraphite.src;
  }, [productConfig.bgColor, isBackView]);

  const overlays = useMemo(() => {
    if (isBackView) {
      return buildCrewNeckBackOverlays({ backLogoUrl: productConfig.backLogoUrl });
    }
    return buildCrewNeckFrontOverlays({
      leftChestLogoUrl: productConfig.leftChestLogoUrl,
      rightChestLogoUrl: productConfig.rightChestLogoUrl,
    });
  }, [productConfig, isBackView]);

  return (
    <div className="w-full">
      <ProductCanvas
        bgImageSrc={baseCrewNeckSrc}
        overlays={overlays}
        bgImageAlt={isBackView ? "Crew Neck back preview" : "Crew Neck preview"}
        className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-xl bg-slate-50"
        canvasClassName="pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => setIsBackView((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-400 bg-gray-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-600"
        >
          <span
            className={`inline-block transition-transform ${
              isBackView ? "rotate-180" : ""
            }`}
          >
            ↺
          </span>
          <span>{isBackView ? "Show front" : "Show back"}</span>
        </button>
      </div>
    </div>
  );
}
