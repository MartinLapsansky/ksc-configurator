"use client";

import React, { useCallback } from "react";
import type { JerseyPreviewProps } from "../types/jerseyPreview.types";
import type { BackLogoTextConfig } from "../../../pickerComponents/TextInsertPicker";

import SponsorTextOverlay from "@/components/productPreviewComponents/jerseyView/overlays/sponsorTextOverlay";
import ProductPreview from "../../ProductPreview";
import { buildFrontOverlays, buildBackOverlays } from "../../utils/buildOverlays";

const JerseyPreview: React.FC<JerseyPreviewProps> = ({
  bgColor,
  stripeColor,
  brandingColor,
  leftChestLogoUrl,
  rightLogo,
  sponsorLogoUrl,
  sponsorText,
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
      });
    },
    [
      stripeColor,
      brandingColor,
      leftChestLogoUrl,
      rightLogo,
      sponsorLogoUrl,
      backLogoUrl,
    ],
  );

  const renderChildren = useCallback(
    (isBackView: boolean) => {
      const activeSponsorText: BackLogoTextConfig | undefined = isBackView
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
