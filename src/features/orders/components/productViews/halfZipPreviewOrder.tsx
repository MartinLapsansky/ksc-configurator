"use client";

import React, { useMemo } from "react";
import type { ProductConfig } from "@/types/preview";
import { ProductCanvas } from "@/components/ui/ProductCanvas";
import { buildHalfZipOverlays } from "@/lib/buildOverlays";
import {
  HALFZIP_BG_OPTIONS,
  HALFZIP_DEFAULT_FRONT_SRC,
  findOptionSrc,
} from "@/lib/productCatalog";

type HalfZipPreviewOrderProps = {
  productConfig: ProductConfig;
};

export default function HalfZipPreviewOrder({
  productConfig,
}: HalfZipPreviewOrderProps) {
  const baseZipSrc = useMemo(() => {
    const src = findOptionSrc(HALFZIP_BG_OPTIONS, productConfig.bgColor?.name);
    return src ?? HALFZIP_DEFAULT_FRONT_SRC;
  }, [productConfig.bgColor]);

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
        className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-xl bg-slate-50"
        canvasClassName="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}