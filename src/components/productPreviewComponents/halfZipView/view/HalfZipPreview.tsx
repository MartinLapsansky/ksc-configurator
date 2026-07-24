"use client";

import React, { useMemo } from "react";
import type { HalfZipPreviewProps } from "../types/halfZipPreview.types";

import { ProductCanvas } from "@/app/contexts/ProductCanvasContext";
import { buildHalfZipOverlays } from "../../utils/buildOverlays";

const HalfZipPreview: React.FC<HalfZipPreviewProps> = ({
  bgColor,
  leftChestLogoUrl,
  rightChestLogoUrl,
}) => {

  const overlays = useMemo(() => {
    return buildHalfZipOverlays({
      leftChestLogoUrl,
      rightChestLogoUrl,
    });
  }, [leftChestLogoUrl, rightChestLogoUrl]);

  const bgImageSrc = useMemo(() => {
    if (!bgColor.file) return "";

    const resolveSrc = (file?: string | { src: string }) => {
      if (!file) return "";
      return typeof file === "string" ? file : file.src;
    };

    return resolveSrc(bgColor.file);
  }, [bgColor]);

  return (
    <div className="flex flex-col w-full h-[70vh]">
      <ProductCanvas
        bgImageSrc={bgImageSrc}
        overlays={overlays}
        bgImageAlt="Half Zip"
      />
    </div>
  );
};

export default HalfZipPreview;
