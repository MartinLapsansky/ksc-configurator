"use client";

import React, { useCallback } from "react";
import type { CrewNeckPreviewProps } from "../types/crewNeckPreview.types";

import ProductPreview from "../../ProductPreview";
import { buildCrewNeckFrontOverlays, buildCrewNeckBackOverlays } from "../../utils/buildOverlays";

const CrewNeckPreview: React.FC<CrewNeckPreviewProps> = ({
  bgColor,
  leftChestLogoUrl,
  rightChestLogoUrl,
  backLogoUrl,
}) => {
  const buildOverlays = useCallback(
    (isBackView: boolean) => {
      if (isBackView) {
        return buildCrewNeckBackOverlays({ backLogoUrl });
      }
      return buildCrewNeckFrontOverlays({ leftChestLogoUrl, rightChestLogoUrl });
    },
    [leftChestLogoUrl, rightChestLogoUrl, backLogoUrl],
  );

  return (
    <ProductPreview
      bgColor={bgColor}
      buildOverlays={buildOverlays}
      bgImageAlt="Crewneck"
      hasBackView
    />
  );
};

export default CrewNeckPreview;
