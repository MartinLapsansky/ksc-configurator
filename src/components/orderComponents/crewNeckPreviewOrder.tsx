"use client";

import React from "react";
import type { ProductConfig } from "@/types/preview";
import { ProductCanvas } from "@/app/contexts/ProductCanvasContext";

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

type CrewNeckPreviewOrderProps = {
  productConfig: ProductConfig;
};

export default function CrewNeckPreviewOrder({ productConfig }: CrewNeckPreviewOrderProps) {
  const baseCrewNeckSrc = productConfig.bgColor?.name
    ? BASE_CREWNECK_BY_NAME[productConfig.bgColor.name] ?? crewNeckBlackGraphite.src
    : crewNeckBlackGraphite.src;

  return (
    <div className="w-full">
      <ProductCanvas
        bgImageSrc={baseCrewNeckSrc}
        overlays={[]}
        bgImageAlt="Crew Neck preview"
        className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl bg-slate-50"
        canvasClassName="h-full w-full"
      />
    </div>
  );
}
