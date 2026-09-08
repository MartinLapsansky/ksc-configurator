"use client";

import React, { useMemo, useState } from "react";
import type { ProductConfig } from "@/types/preview";
import { ProductCanvas } from "@/components/ui/ProductCanvas";
import ProductFlipButton from "@/components/ui/ProductFlipButton";
import {
  buildCrewNeckFrontOverlays,
  buildCrewNeckBackOverlays,
} from "@/lib/buildOverlays";
import {
  CREWNECK_BG_OPTIONS,
  CREWNECK_DEFAULT_BACK_SRC,
  CREWNECK_DEFAULT_FRONT_SRC,
  findOptionSrc,
} from "@/lib/productCatalog";

type CrewNeckPreviewOrderProps = {
  productConfig: ProductConfig;
};

export default function CrewNeckPreviewOrder({
  productConfig,
}: CrewNeckPreviewOrderProps) {
  const [isBackView, setIsBackView] = useState(false);

  const baseCrewNeckSrc = useMemo(() => {
    const src = findOptionSrc(
      CREWNECK_BG_OPTIONS,
      productConfig.bgColor?.name,
      isBackView,
    );
    return src ?? (isBackView ? CREWNECK_DEFAULT_BACK_SRC : CREWNECK_DEFAULT_FRONT_SRC);
  }, [productConfig.bgColor, isBackView]);

  const overlays = useMemo(() => {
    if (isBackView) {
      return buildCrewNeckBackOverlays({
        backLogoUrl: productConfig.backLogoUrl,
      });
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
      <ProductFlipButton
        isBackView={isBackView}
        onToggle={() => setIsBackView((prev) => !prev)}
      />
    </div>
  );
}