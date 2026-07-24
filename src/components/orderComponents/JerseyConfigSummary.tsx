"use client";

import React from "react";
import type { ProductConfig } from "@/types/preview";
import ColorChip from "./ColorChip";
import LogoPreview from "./LogoPreview";
import TextConfigPreview from "./TextConfigPreview";

type JerseyConfigSummaryProps = {
  productConfig: ProductConfig;
};

export default function JerseyConfigSummary({
  productConfig,
}: JerseyConfigSummaryProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Product Type</h3>
        <p className="text-sm text-gray-700 capitalize">{productConfig.productType}</p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Colours</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <ColorChip label="Main body" color={productConfig.bgColor && 'hex' in productConfig.bgColor ? productConfig.bgColor : undefined} />
          {productConfig.productType === "jersey" && (
            <>
              <ColorChip label="Stripes" color={productConfig.stripeColor} />
              <ColorChip label="Branding" color={productConfig.brandingColor} />
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Logos</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {productConfig.productType === "jersey" && (
            <LogoPreview label="Right logo" src={productConfig.rightLogo?.src} />
          )}
          <LogoPreview label="Left chest logo" src={productConfig.leftChestLogoUrl} />
          {productConfig.productType === "halfZip" && (
            <LogoPreview label="Right chest logo" src={productConfig.rightChestLogoUrl} />
          )}
          {productConfig.productType === "jersey" && (
            <>
              <LogoPreview label="Sponsor logo" src={productConfig.sponsorLogoUrl} />
              <LogoPreview label="Back logo" src={productConfig.backLogoUrl} />
            </>
          )}
        </div>
      </div>

      {productConfig.productType === "jersey" && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-black">Text</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <TextConfigPreview
              label="Front sponsor text"
              config={productConfig.frontTextConfig}
            />
            <TextConfigPreview
              label="Back sponsor text"
              config={productConfig.backTextConfig}
            />
          </div>
        </div>
      )}
    </div>
  );
}
