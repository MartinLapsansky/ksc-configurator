"use client";

import React, { useMemo, useState } from "react";
import type { BaseColorOption, OverlayEntry } from "@/types/preview";
import { ProductCanvas } from "@/components/ui/ProductCanvas";
import ProductFlipButton from "@/components/ui/ProductFlipButton";

type ProductPreviewProps = {
  bgColor: BaseColorOption;
  /** Builds the overlays for the current view. Receives `isBackView` so products
   *  with a back view can swap their overlay set. */
  buildOverlays: (isBackView: boolean) => OverlayEntry[];
  bgImageAlt: string;
  /** When true, renders a front/back toggle button and uses `backFile` for the back view. */
  hasBackView?: boolean;
  /** Optional content rendered inside the canvas. Receives `isBackView` so it can
   *  react to the current view (e.g., switching sponsor text). */
  renderChildren?: (isBackView: boolean) => React.ReactNode;
};


const resolveSrc = (file?: string | { src: string }) => {
  if (!file) return "";
  return typeof file === "string" ? file : file.src;
};

/**
 * Shared preview shell used by all product types. It owns the front/back view
 * state, resolves the background image source, and renders the ProductCanvas
 * plus the optional flip button. Product-specific overlays are built via the
 * `buildOverlays` callback.
 */
const ProductPreview: React.FC<ProductPreviewProps> = ({
  bgColor,
  buildOverlays,
  bgImageAlt,
  hasBackView = false,
  renderChildren,
}) => {

  const [isBackView, setIsBackView] = useState(false);

  //build all overlays at once
  const overlays = useMemo(
    () => buildOverlays(isBackView),
    [buildOverlays, isBackView],
  );

  const bgImageSrc = useMemo(() => {
    if (!bgColor.file && !bgColor.backFile) return ""; // no product file either front or back

    if (!hasBackView || !isBackView) {
      return resolveSrc(bgColor.file);
    }

    return resolveSrc(bgColor.backFile ?? bgColor.file);
  }, [bgColor, isBackView, hasBackView]);

  return (
    <div className="flex flex-col w-full h-[70vh]">
      <ProductCanvas
        bgImageSrc={bgImageSrc}
        overlays={overlays}
        bgImageAlt={isBackView ? `${bgImageAlt} back base` : `${bgImageAlt} front base`}
      >
        {renderChildren?.(isBackView)}
      </ProductCanvas>


      {hasBackView && (
        <ProductFlipButton
          isBackView={isBackView}
          onToggle={() => setIsBackView((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default ProductPreview;
