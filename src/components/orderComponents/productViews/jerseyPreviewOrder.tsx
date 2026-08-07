"use client";

import React, { useMemo, useState } from "react";
import type { ProductConfig } from "@/types/preview";
import { ProductCanvas } from "@/app/contexts/ProductCanvasContext";
import { buildFrontOverlays, buildBackOverlays } from "../../productPreviewComponents/utils/buildOverlays";

import jerseyHotPinkImg from "@/app/assets/jerseys/jersey-hot-pink.png";
import jerseyLavenderImg from "@/app/assets/jerseys/jersey-levender.png";
import jerseyLimeGreenImg from "@/app/assets/jerseys/jersey-lime-green.png";
import jerseyPurpleImg from "@/app/assets/jerseys/jersey-purple.png";

import jerseyLavenderBackImg from "@/app/assets/jerseys/jersey-levender-back.png";
import jerseyLimeGreenBackImg from "@/app/assets/jerseys/jersey-lime-green-back.png";
import jerseyPurpleBackImg from "@/app/assets/jerseys/jersey-purple-back.png";

const BASE_JERSEY_BY_NAME: Record<string, string> = {
  Pink: jerseyHotPinkImg.src,
  Purple: jerseyPurpleImg.src,
  Lavender: jerseyLavenderImg.src,
  "Pastel green": jerseyLimeGreenImg.src,
};

const BACK_JERSEY_BY_NAME: Record<string, string> = {
  Pink: jerseyPurpleBackImg.src,
  Purple: jerseyPurpleBackImg.src,
  Lavender: jerseyLavenderBackImg.src,
  "Pastel green": jerseyLimeGreenBackImg.src,
};

type JerseyPreviewOrderProps = {
  productConfig: ProductConfig;
};

export default function JerseyPreviewOrder({ productConfig }: JerseyPreviewOrderProps) {
  const [isBackView, setIsBackView] = useState(false);

  const baseJerseySrc = useMemo(() => {
    const name = productConfig.bgColor?.name?.trim();
    if (isBackView) {
      return (name ? BACK_JERSEY_BY_NAME[name] : undefined) ?? jerseyPurpleBackImg.src;
    }
    return (name ? BASE_JERSEY_BY_NAME[name] : undefined) ?? jerseyPurpleImg.src;
  }, [productConfig.bgColor, isBackView]);

  const overlays = useMemo(() => {
    if (!productConfig.stripeColor || !productConfig.brandingColor) {
      return [];
    }

    if (isBackView) {
      return buildBackOverlays({
        stripeColor: productConfig.stripeColor,
        backLogoUrl: productConfig.backLogoUrl,
      });
    }

    return buildFrontOverlays({
      stripeColor: productConfig.stripeColor,
      brandingColor: productConfig.brandingColor,
      leftChestLogoUrl: productConfig.leftChestLogoUrl,
      rightLogo: productConfig.rightLogo,
      sponsorLogoUrl: productConfig.sponsorLogoUrl,
      rightSleeveLogoUrl: productConfig.rightSleeveLogoUrl,
      leftSleeveLogoUrl: productConfig.leftSleeveLogoUrl
    });
  }, [productConfig, isBackView]);

  return (
    <div className="w-full">
      <ProductCanvas
        bgImageSrc={baseJerseySrc}
        overlays={overlays}
        bgImageAlt={isBackView ? "Jersey back preview" : "Jersey preview"}
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
