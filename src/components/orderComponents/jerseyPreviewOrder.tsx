"use client";

import React, { useMemo } from "react";
import type { ProductConfig } from "@/types/preview";
import { ProductCanvas } from "@/app/contexts/ProductCanvasContext";
import { buildFrontOverlays } from "../productPreviewComponents/utils/buildOverlays";

import jerseyHotPinkImg from "@/app/assets/jerseys/jersey-hot-pink.png";
import jerseyLavenderImg from "@/app/assets/jerseys/jersey-levender.png";
import jerseyLimeGreenImg from "@/app/assets/jerseys/jersey-lime-green.png";
import jerseyPurpleImg from "@/app/assets/jerseys/jersey-purple.png";

const BASE_JERSEY_BY_NAME: Record<string, string> = {
  Pink: jerseyHotPinkImg.src,
  Purple: jerseyPurpleImg.src,
  Lavender: jerseyLavenderImg.src,
  "Pastel green": jerseyLimeGreenImg.src,
};

type JerseyPreviewOrderProps = {
  productConfig: ProductConfig;
};

export default function JerseyPreviewOrder({ productConfig }: JerseyPreviewOrderProps) {

  const baseJerseySrc = useMemo(() => {
    const name = productConfig.bgColor?.name?.trim();
    return (name ? BASE_JERSEY_BY_NAME[name] : undefined) ?? jerseyPurpleImg.src;
  }, [productConfig.bgColor]);

  const overlays = useMemo(() => {
    if (!productConfig.stripeColor || !productConfig.brandingColor) {
      return [];
    }

    return buildFrontOverlays({
      stripeColor: productConfig.stripeColor,
      brandingColor: productConfig.brandingColor,
      leftChestLogoUrl: productConfig.leftChestLogoUrl,
      rightLogo: productConfig.rightLogo,
      sponsorLogoUrl: productConfig.sponsorLogoUrl,
    });
  }, [productConfig]);

  return (
    <div className="w-full">
      <ProductCanvas
        bgImageSrc={baseJerseySrc}
        overlays={overlays}
        bgImageAlt="Jersey preview"
        className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl bg-slate-50"
        canvasClassName="h-full w-full"
      />
    </div>
  );
}
