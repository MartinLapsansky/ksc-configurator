"use client";

import React, { useMemo, useState } from "react";
import type { ProductConfig } from "@/types/preview";
import { ProductCanvas } from "@/components/ui/ProductCanvas";
import ProductFlipButton from "@/components/ui/ProductFlipButton";
import {
  buildFrontOverlays,
  buildBackOverlays,
} from "@/lib/buildOverlays";
import {
  JERSEY_BG_OPTIONS,
  JERSEY_DEFAULT_BACK_SRC,
  JERSEY_DEFAULT_FRONT_SRC,
  findOptionSrc,
} from "@/lib/productCatalog";

type JerseyPreviewOrderProps = {
  productConfig: ProductConfig;
};

export default function JerseyPreviewOrder({
  productConfig,
}: JerseyPreviewOrderProps) {
  const [isBackView, setIsBackView] = useState(false);

  const baseJerseySrc = useMemo(() => {
    const src = findOptionSrc(
      JERSEY_BG_OPTIONS,
      productConfig.bgColor?.name?.trim(),
      isBackView,
    );
    return src ?? (isBackView ? JERSEY_DEFAULT_BACK_SRC : JERSEY_DEFAULT_FRONT_SRC);
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
      leftSleeveLogoUrl: productConfig.leftSleeveLogoUrl,
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
      <ProductFlipButton
        isBackView={isBackView}
        onToggle={() => setIsBackView((prev) => !prev)}
      />
    </div>
  );
}