"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useProductCanvasContext } from "@/contexts/ProductCanvasContext";

type TextOverlayProps = {
  text: string;
  colorHex: string;
  /** Percentage position (0..1) within the drawn product image. */
  position: { x: number; y: number };
};

/**
 * Renders customer-provided text over the product preview at a configurable
 * percentage position. Used by the data-driven configurator for any text picker.
 */
const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  colorHex,
  position,
}) => {
  const { containerRef, bgImageRef } = useProductCanvasContext();
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  const recalc = useCallback(() => {
    const container = containerRef.current;
    const bgImg = bgImageRef.current;
    if (!container || !bgImg || !bgImg.naturalWidth || !bgImg.naturalHeight) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const iw = bgImg.naturalWidth;
    const ih = bgImg.naturalHeight;
    const s = Math.min(w / iw, h / ih);
    const drawnWidth = iw * s;
    const drawnHeight = ih * s;
    const offsetX = (w - drawnWidth) / 2;
    const offsetY = (h - drawnHeight) / 2;

    const xPx = offsetX + position.x * drawnWidth;
    const yPx = offsetY + position.y * drawnHeight;

    setPos({
      left: (xPx / w) * 100,
      top: (yPx / h) * 100,
    });
  }, [containerRef, bgImageRef, position.x, position.y]);

  useEffect(() => {
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  useEffect(() => {
    const bgImg = bgImageRef.current;
    if (bgImg) {
      bgImg.addEventListener("load", recalc);
      return () => bgImg.removeEventListener("load", recalc);
    }
  }, [bgImageRef, recalc]);

  if (!pos || !text) return null;

  return (
    <div
      className="pointer-events-none absolute text-xl font-extrabold tracking-widest -translate-x-1/2 -translate-y-1/2"
      style={{
        color: colorHex,
        left: `${pos.left}%`,
        top: `${pos.top}%`,
      }}
    >
      {text}
    </div>
  );
};

export default TextOverlay;