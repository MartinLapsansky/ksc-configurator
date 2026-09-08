"use client";

import React, { useMemo, useState } from "react";
import type {
  ProductConfig,
} from "@/types/preview";
import { ProductCanvas } from "@/components/ui/ProductCanvas";
import ProductFlipButton from "@/components/ui/ProductFlipButton";
import { buildOverlaysFromDefinition } from "@/features/configurator/utils/buildOverlaysFromDefinition";
import { resolveBaseImageSrc } from "@/features/configurator/utils/configurationValues";

type GenericOrderPreviewProps = {
  productConfig: ProductConfig;
};

/**
 * Data-driven order preview. Uses the stored `definitionSnapshot` and `values`
 * to render the same canvas view as the configurator without relying on the
 * client-side image imports that previously lived in `productCatalog.ts`.
 */
export default function GenericOrderPreview({
  productConfig,
}: GenericOrderPreviewProps) {
  const [isBackView, setIsBackView] = useState(false);

  const definition = productConfig.definitionSnapshot;
  const values = useMemo(
    () => productConfig.values ?? {},
    [productConfig.values],
  );

  const overlays = useMemo(
    () =>
      definition
        ? buildOverlaysFromDefinition(definition, values, isBackView)
        : [],
    [definition, values, isBackView],
  );

  const bgImageSrc = useMemo(
    () =>
      definition
        ? resolveBaseImageSrc(definition, values, isBackView, {
            frontImageUrl: null,
            backImageUrl: null,
          })
        : "",
    [definition, values, isBackView],
  );

  if (!definition) return null;

  return (
    <div className="w-full">
      <ProductCanvas
        bgImageSrc={bgImageSrc}
        overlays={overlays}
        bgImageAlt={
          isBackView
            ? `${productConfig.productName} back preview`
            : `${productConfig.productName} preview`
        }
        className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-xl bg-slate-50"
        canvasClassName="pointer-events-none absolute inset-0 h-full w-full"
      />
      {productConfig.productName && definition.overlays.back && (
        <ProductFlipButton
          isBackView={isBackView}
          onToggle={() => setIsBackView((prev) => !prev)}
        />
      )}
    </div>
  );
}