"use client";

import React, { useCallback, useEffect, useState } from "react";

const SPONSOR_TEXT_POS = { x: 0.49, y: 0.54 };

type SponsorTextOverlayProps = {
  text: string;
  colorHex: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  bgImageRef: React.RefObject<HTMLImageElement | null>;
};

const SponsorTextOverlay: React.FC<SponsorTextOverlayProps> = ({
  text,
  colorHex,
  containerRef,
  bgImageRef,
}) => {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  const recalc = useCallback(() => {
    const container = containerRef.current;
    const bgImg = bgImageRef.current;
    if (!container || !bgImg || !bgImg.naturalWidth || !bgImg.naturalHeight) return;

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

    const xPx = offsetX + SPONSOR_TEXT_POS.x * drawnWidth;
    const yPx = offsetY + SPONSOR_TEXT_POS.y * drawnHeight;

    setPos({
      left: (xPx / w) * 100,
      top: (yPx / h) * 100,
    });
  }, [containerRef, bgImageRef]);

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

  if (!pos) return null;

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

export default SponsorTextOverlay;