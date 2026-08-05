"use client";

import React, { useCallback } from "react";
import type { HalfZipPreviewProps } from "../types/halfZipPreview.types";

import ProductPreview from "../../ProductPreview";
import { buildHalfZipOverlays } from "../../utils/buildOverlays";

const HalfZipPreview: React.FC<HalfZipPreviewProps> = ({
  bgColor,
  leftChestLogoUrl,
  rightChestLogoUrl,
}) => {
  const buildOverlays = useCallback(
    () => buildHalfZipOverlays({ leftChestLogoUrl, rightChestLogoUrl }),
    [leftChestLogoUrl, rightChestLogoUrl],
  );

  return (
    <ProductPreview
      bgColor={bgColor}
      buildOverlays={buildOverlays}
      bgImageAlt="Half Zip"
    />
  );
};

export default HalfZipPreview;
