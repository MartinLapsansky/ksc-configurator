"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useProductCanvasContext } from "@/contexts/ProductCanvasContext";
import {
  getImageAlphaBounds,
  type ImageAlphaBounds,
} from "@/lib/previewHelpers";

type TextOverlayProps = {
  text: string;
  colorHex: string;
  /** Percentage position (0..1) within the drawn product image. */
  position: { x: number; y: number };
  /**
   * URL of an alpha-mask image describing the printable area. When provided,
   * the text is centered inside that area (and clamped so it never overflows
   * it). When omitted, `position` is used directly.
   */
  areaSrc?: string;
};

type Pos = { left: number; top: number };

/**
 * Renders customer-provided text over the product preview. If an `areaSrc`
 * mask is given, the text is positioned from the mask's opaque bounds rather
 * than the raw percentage point.
 */
const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  colorHex,
  position,
  areaSrc,
}) => {
  const { containerRef, bgImageRef } = useProductCanvasContext();
  const textRef = useRef<HTMLDivElement | null>(null);
  const areaBoundsRef = useRef<ImageAlphaBounds | null>(null);
  const [pos, setPos] = useState<Pos | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const bgImg = bgImageRef.current;
    if (!container || !bgImg || !bgImg.naturalWidth || !bgImg.naturalHeight) {
      return;
    }

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const scale = Math.min(
      rect.width / bgImg.naturalWidth,
      rect.height / bgImg.naturalHeight,
    );
    const drawnWidth = bgImg.naturalWidth * scale;
    const drawnHeight = bgImg.naturalHeight * scale;
    const offsetX = (rect.width - drawnWidth) / 2;
    const offsetY = (rect.height - drawnHeight) / 2;

    let centerX: number;
    let centerY: number;

    const area = areaBoundsRef.current;
    if (area) {
      const areaX = offsetX + area.left * drawnWidth;
      const areaY = offsetY + area.top * drawnHeight;
      const areaW = area.width * drawnWidth;
      const areaH = area.height * drawnHeight;

      const textEl = textRef.current;
      const textW = textEl?.offsetWidth ?? 0;
      const textH = textEl?.offsetHeight ?? 0;

      const minX = areaX + textW / 2;
      const maxX = areaX + areaW - textW / 2;
      const minY = areaY + textH / 2;
      const maxY = areaY + areaH - textH / 2;

      const rawCenterX = areaX + areaW / 2;
      const rawCenterY = areaY + areaH / 2;

      centerX =
        maxX >= minX
          ? Math.min(Math.max(rawCenterX, minX), maxX)
          : rawCenterX;
      centerY =
        maxY >= minY
          ? Math.min(Math.max(rawCenterY, minY), maxY)
          : rawCenterY;
    } else {
      centerX = offsetX + position.x * drawnWidth;
      centerY = offsetY + position.y * drawnHeight;
    }

    setPos({
      left: (centerX / rect.width) * 100,
      top: (centerY / rect.height) * 100,
    });
  }, [containerRef, bgImageRef, position.x, position.y]);

  // Load and measure the optional area mask. Reads are done in async callbacks
  // (or a rAF) so no state is updated synchronously in the effect body.
  useEffect(() => {
    if (!areaSrc) {
      areaBoundsRef.current = null;
      const rafId = requestAnimationFrame(measure);
      return () => cancelAnimationFrame(rafId);
    }

    let cancelled = false;
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      areaBoundsRef.current = getImageAlphaBounds(img) ?? null;
      requestAnimationFrame(measure);
    };
    img.onerror = () => {
      if (cancelled) return;
      areaBoundsRef.current = null;
      requestAnimationFrame(measure);
    };
    img.src = areaSrc;

    return () => {
      cancelled = true;
    };
  }, [areaSrc, measure]);

  // Initial measurement + resize handling.
  useEffect(() => {
    let rafId = requestAnimationFrame(measure);
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  // Re-measure once the background image finishes decoding.
  useEffect(() => {
    const bgImg = bgImageRef.current;
    if (!bgImg) return;
    const onLoad = () => requestAnimationFrame(measure);
    bgImg.addEventListener("load", onLoad);
    return () => bgImg.removeEventListener("load", onLoad);
  }, [bgImageRef, measure]);

  // Re-measure when the text changes so the clamp uses the new text size.
  useLayoutEffect(() => {
    const rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, [measure, text]);

  if (!text) return null;

  return (
    <div
      ref={textRef}
      className="pointer-events-none absolute text-xl font-extrabold tracking-widest -translate-x-1/2 -translate-y-1/2"
      style={{
        color: colorHex,
        left: `${pos?.left ?? 0}%`,
        top: `${pos?.top ?? 0}%`,
        visibility: pos ? "visible" : "hidden",
      }}
    >
      {text}
    </div>
  );
};

export default TextOverlay;