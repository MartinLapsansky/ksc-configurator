"use client";

import React, { useCallback } from "react";
import type { HalfZipPreviewProps } from "@/features/configurator/components/previews/halfZipView/types/halfZipPreview.types";

import ProductPreview from "@/features/configurator/components/previews/ProductPreview";
import { buildHalfZipOverlays } from "@/lib/buildOverlays";

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
