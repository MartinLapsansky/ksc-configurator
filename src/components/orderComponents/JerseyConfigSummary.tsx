"use client";

import React from "react";
import type { JerseyConfig } from "@/types/preview";
import ColorChip from "./ColorChip";
import LogoPreview from "./LogoPreview";
import TextConfigPreview from "./TextConfigPreview";

type JerseyConfigSummaryProps = {
  jerseyConfig: JerseyConfig;
};

export default function JerseyConfigSummary({
  jerseyConfig,
}: JerseyConfigSummaryProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Colours</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <ColorChip label="Main body" color={jerseyConfig.bgColor} />
          <ColorChip label="Stripes" color={jerseyConfig.stripeColor} />
          <ColorChip label="Branding" color={jerseyConfig.brandingColor} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Logos</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <LogoPreview label="Right logo" src={jerseyConfig.rightLogo?.src} />
          <LogoPreview label="Left chest logo" src={jerseyConfig.leftChestLogoUrl} />
          <LogoPreview label="Sponsor logo" src={jerseyConfig.sponsorLogoUrl} />
          <LogoPreview label="Back logo" src={jerseyConfig.backLogoUrl} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-black">Text</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <TextConfigPreview
            label="Front sponsor text"
            config={jerseyConfig.frontTextConfig}
          />
          <TextConfigPreview
            label="Back sponsor text"
            config={jerseyConfig.backTextConfig}
          />
        </div>
      </div>

      {/*<details className="rounded-md border border-gray-200 bg-gray-50 p-3">*/}
      {/*  <summary className="cursor-pointer text-sm font-medium text-black">*/}
      {/*    Show raw JSON*/}
      {/*  </summary>*/}
      {/*  <pre className="mt-3 overflow-x-auto rounded bg-white p-3 text-xs text-gray-800">*/}
      {/*    {JSON.stringify(jerseyConfig, null, 2)}*/}
      {/*  </pre>*/}
      {/*</details>*/}
    </div>
  );
}