"use client";

import React from "react";
import type { ProductConfig } from "@/types/preview";
import type { PickerDef } from "@/features/configurator/schemas/productDefinitionSchema";
import ColorChip from "./ColorChip";
import LogoPreview from "./LogoPreview";
import TextConfigPreview from "./TextConfigPreview";

type ProductConfigSummaryProps = {
  productConfig: ProductConfig;
};

/**
 * Universal summary for any product type.
 *
 * Data-driven products render their values generically from
 * `definitionSnapshot.pickers`. Legacy products (no snapshot) fall back to the
 * previous explicit field layout.
 */
export default function ProductConfigSummary({
  productConfig,
}: ProductConfigSummaryProps) {
  if (productConfig.definitionSnapshot) {
    return <DataDrivenSummary productConfig={productConfig} />;
  }

  return <LegacySummary productConfig={productConfig} />;
}

function DataDrivenSummary({ productConfig }: ProductConfigSummaryProps) {
  const definition = productConfig.definitionSnapshot!;
  const values = productConfig.values ?? {};

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Product Type</h3>
        <p className="text-sm text-gray-700 capitalize">
          {productConfig.productName}
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {definition.pickers.map((picker) => (
          <PickerValue
            key={picker.key}
            picker={picker}
            value={values[picker.key]}
          />
        ))}
      </div>
    </div>
  );
}

function PickerValue({
  picker,
  value,
}: {
  picker: PickerDef;
  value: unknown;
}) {
  switch (picker.type) {
    case "color":
    case "doubleColor":
    case "tripleColor":
      return <ColorChip label={picker.label} color={value as never} />;

    case "imageUpload":
      return (
        <LogoPreview
          label={picker.label}
          src={typeof value === "string" ? value : undefined}
        />
      );

    case "staticLogo": {
      const logo = value as { name?: string; src?: string } | undefined;
      return <LogoPreview label={picker.label} src={logo?.src} />;
    }

    case "text":
      return (
        <TextConfigPreview
          label={picker.label}
          config={value as never}
        />
      );
  }
}

function LegacySummary({ productConfig }: ProductConfigSummaryProps) {
  const { productType } = productConfig;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Product Type</h3>
        <p className="text-sm text-gray-700 capitalize">{productType}</p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Colours</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <ColorChip label="Main body" color={productConfig.bgColor} />
          {productType === "jersey" && (
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
          {productType === "jersey" && (
            <LogoPreview label="Right logo" src={productConfig.rightLogo?.src} />
          )}
          <LogoPreview label="Left chest logo" src={productConfig.leftChestLogoUrl} />
          {(productType === "halfZip" || productType === "crewNeck") && (
            <LogoPreview label="Right chest logo" src={productConfig.rightChestLogoUrl} />
          )}
          {productType === "jersey" && (
            <>
              <LogoPreview label="Sponsor logo" src={productConfig.sponsorLogoUrl} />
              <LogoPreview label="Back logo" src={productConfig.backLogoUrl} />
              <LogoPreview label="Left sleeve logo" src={productConfig.leftSleeveLogoUrl} />
              <LogoPreview label="Right sleeve logo" src={productConfig.rightSleeveLogoUrl} />
            </>
          )}
          {productType === "crewNeck" && (
            <LogoPreview label="Back logo" src={productConfig.backLogoUrl} />
          )}
        </div>
      </div>

      {productType === "jersey" && (
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