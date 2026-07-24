"use client";

import React, { useMemo, useState } from "react";
import type { JerseyPreviewProps } from "../types/jerseyPreview.types";
import type { BackLogoTextConfig } from "../../../pickerComponents/TextInsertPicker";

import SponsorTextOverlay from "@/components/productPreviewComponents/jerseyView/overlays/sponsorTextOverlay";
import { ProductCanvas } from "@/app/contexts/ProductCanvasContext";
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
  const [isBackView, setIsBackView] = useState(false);

  const overlays = useMemo(() => {
    if (!isBackView) {
      return buildFrontOverlays({
        stripeColor,
        brandingColor,
        leftChestLogoUrl,
        rightLogo,
        sponsorLogoUrl,
      });
    } else {
      return buildBackOverlays({
        stripeColor,
        backLogoUrl,
      });
    }
  }, [
    isBackView,
    stripeColor,
    brandingColor,
    leftChestLogoUrl,
    rightLogo,
    sponsorLogoUrl,
    backLogoUrl,
  ]);


  const bgImageSrc = useMemo(() => {
    if (!bgColor.file && !bgColor.backFile) return "";

    const resolveSrc = (file?: string | { src: string }) => {
      if (!file) return "";
      return typeof file === "string" ? file : file.src;
    };

    if (!isBackView) {
      return resolveSrc(bgColor.file);
    }

    return resolveSrc(bgColor.backFile ?? bgColor.file);
  }, [bgColor, isBackView]);

  const activeSponsorText: BackLogoTextConfig | undefined = useMemo(() => {
    if (!isBackView) {
      return sponsorText;
    }
    return backTextConfig ?? sponsorText;
  }, [isBackView, sponsorText, backTextConfig]);

  return (
    <div className="flex flex-col w-full h-[70vh]">
      <ProductCanvas
        bgImageSrc={bgImageSrc}
        overlays={overlays}
        bgImageAlt={isBackView ? "Jersey back base" : "Jersey front base"}
      >
        {activeSponsorText?.enabled && (
          <SponsorTextOverlay
            text={activeSponsorText.text}
            colorHex={activeSponsorText.color.hex}
          />
        )}
      </ProductCanvas>

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

export default JerseyPreview;
