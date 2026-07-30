"use client";

import React, { useMemo, useState } from "react";
import type { CrewNeckPreviewProps } from "../types/crewNeckPreview.types";

import { ProductCanvas } from "@/app/contexts/ProductCanvasContext";
import { buildCrewNeckFrontOverlays, buildCrewNeckBackOverlays } from "../../utils/buildOverlays";

const CrewNeckPreview: React.FC<CrewNeckPreviewProps> = ({
  bgColor,
  leftChestLogoUrl,
  rightChestLogoUrl,
  backLogoUrl,
}) => {
  const [isBackView, setIsBackView] = useState(false);

  const overlays = useMemo(() => {
    if (!isBackView) {
      return buildCrewNeckFrontOverlays({
        leftChestLogoUrl,
        rightChestLogoUrl,
      });
    } else {
      return buildCrewNeckBackOverlays({
        backLogoUrl,
      });
    }
  }, [isBackView, leftChestLogoUrl, rightChestLogoUrl, backLogoUrl]);

  const bgImageSrc = useMemo(() => {
    if (!bgColor.file) return "";

    const resolveSrc = (file?: string | { src: string }) => {
      if (!file) return "";
      return typeof file === "string" ? file : file.src;
    };

    if (!isBackView) {
      return resolveSrc(bgColor.file);
    }

    return resolveSrc(bgColor.file);
  }, [bgColor, isBackView]);

  return (
    <div className="flex flex-col w-full h-[70vh]">
      <ProductCanvas
        bgImageSrc={bgImageSrc}
        overlays={overlays}
        bgImageAlt={isBackView ? "Crewneck back base" : "Crewneck front base"}
      />

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => setIsBackView((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-400 bg-gray-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-600"
        >
          <span
            className={`inline-block transition-transform ${
              isBackView ? "rotate-180" : ""
            }`}
          >
            ↺
          </span>
          <span>{isBackView ? "Show front" : "Show back"}</span>
        </button>
      </div>
    </div>
  );
};

export default CrewNeckPreview;
