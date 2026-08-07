"use client";

import React, { useMemo } from "react";
import type { ProductConfig } from "@/types/preview";
import { ProductCanvas } from "@/app/contexts/ProductCanvasContext";
import { buildHalfZipOverlays } from "../../productPreviewComponents/utils/buildOverlays";

import zipBlackGraphite from "@/app/assets/zip-tops/zip_black_graphite.png";

import zipBlackGreen from "@/app/assets/zip-tops/zip_black_green.png";
import zipBlackRed from "@/app/assets/zip-tops/zip_black_red.png";
import zipNavyGreen from "@/app/assets/zip-tops/zip_navy_green.png";
import zipNavyMaroon from "@/app/assets/zip-tops/zip_navy_maroon.png";
import zipNavyRoyal from "@/app/assets/zip-tops/zip_navy_royal.png";
import zipNavySky from "@/app/assets/zip-tops/zip_navy_sky.png";

const BASE_ZIP_BY_NAME: Record<string, string> = {
  "Black / Graphite": zipBlackGraphite.src,
  "Black / Green": zipBlackGreen.src,
  "Black / Red": zipBlackRed.src,
  "Navy / Green": zipNavyGreen.src,
  "Navy / Maroon": zipNavyMaroon.src,
  "Navy / Royal": zipNavyRoyal.src,
  "Navy / Sky": zipNavySky.src,
};

type HalfZipPreviewOrderProps = {
  productConfig: ProductConfig;
};

export default function HalfZipPreviewOrder({ productConfig }: HalfZipPreviewOrderProps) {
  const baseZipSrc = productConfig.bgColor?.name
    ? BASE_ZIP_BY_NAME[productConfig.bgColor.name] ?? zipBlackGraphite.src
    : zipBlackGraphite.src;

  const overlays = useMemo(
    () =>
      buildHalfZipOverlays({
        leftChestLogoUrl: productConfig.leftChestLogoUrl,
        rightChestLogoUrl: productConfig.rightChestLogoUrl,
      }),
    [productConfig.leftChestLogoUrl, productConfig.rightChestLogoUrl],
  );

  return (
    <div className="w-full">
      <ProductCanvas
        bgImageSrc={baseZipSrc}
        overlays={overlays}
        bgImageAlt="Half Zip preview"

        className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl bg-slate-50"
        canvasClassName="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
