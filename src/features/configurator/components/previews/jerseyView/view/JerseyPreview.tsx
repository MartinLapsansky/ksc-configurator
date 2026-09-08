"use client";

import React, { useCallback } from "react";
import type { TextConfig } from "@/types/preview";
import type { JerseyPreviewProps } from "@/features/configurator/components/previews/jerseyView/types/jerseyPreview.types";

import SponsorTextOverlay from "@/features/configurator/components/previews/jerseyView/overlays/sponsorTextOverlay";
import ProductPreview from "@/features/configurator/components/previews/ProductPreview";
import {
  buildFrontOverlays,
  buildBackOverlays,
} from "@/lib/buildOverlays";

const JerseyPreview: React.FC<JerseyPreviewProps> = ({
  bgColor,
  stripeColor,
  brandingColor,
  leftChestLogoUrl,
  rightLogo,
  sponsorLogoUrl,
  sponsorText,
  leftSleeveLogoUrl,
  rightSleeveLogoUrl,
  backLogoUrl,
  backTextConfig,
}) => {
  const buildOverlays = useCallback(
    (isBackView: boolean) => {
      if (isBackView) {
        return buildBackOverlays({ stripeColor, backLogoUrl });
      }
      return buildFrontOverlays({
        stripeColor,
        brandingColor,
        leftChestLogoUrl,
        rightLogo,
        sponsorLogoUrl,
        leftSleeveLogoUrl,
        rightSleeveLogoUrl,
      });
    },
    [
      stripeColor,
      brandingColor,
      leftChestLogoUrl,
      rightLogo,
      sponsorLogoUrl,
      leftSleeveLogoUrl,
      rightSleeveLogoUrl,
      backLogoUrl,
    ],
  );

  //only for jersey actual
  const renderChildren = useCallback(
    (isBackView: boolean) => {
      const activeSponsorText: TextConfig | undefined = isBackView
        ? backTextConfig ?? sponsorText
        : sponsorText;

      if (!activeSponsorText?.enabled) return null;

      return (
        <SponsorTextOverlay
          text={activeSponsorText.text}
          colorHex={activeSponsorText.color.hex}
        />
      );
    },
    [sponsorText, backTextConfig],
  );

  return (
    <ProductPreview
      bgColor={bgColor}
      buildOverlays={buildOverlays}
      bgImageAlt="Jersey"
      hasBackView
      renderChildren={renderChildren}
    />
  );
};

export default JerseyPreview;
