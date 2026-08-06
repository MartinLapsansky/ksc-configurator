import { useCallback, useEffect, useRef } from "react";
import type { OverlayEntry } from "@/types/preview";
import {
  drawFitted,
  drawUploadIntoLayerBounds,
  drawTintedLayer,
} from "@/components/productPreviewComponents/utils/PreviewHelpers";

type UseProductCanvasParams = {
  overlays: OverlayEntry[];
  loadImage: (src: string) => Promise<HTMLImageElement>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
  bgImageRef: React.RefObject<HTMLImageElement | null>;
};

/**
 * Caps the effective pixel ratio for the main canvas. On high-DPR mobile
 * devices (DPR 3+) a full-resolution canvas can be enormous and quickly
 * exhaust the browser's memory budget, causing "page crashed".
 */
const MAX_DPR = 2;

export const useProductCanvas = ({
  overlays,
  loadImage,
  canvasRef,
  previewContainerRef,
  bgImageRef,
}: UseProductCanvasParams) => {
  // Keep the latest overlays in a ref so the draw callback stays stable and
  // we don't re-run the effect (and re-allocate canvases) on every render.
  const overlaysRef = useRef(overlays);
  useEffect(() => {
    overlaysRef.current = overlays;
  }, [overlays]);

  const performDraw = useCallback(async () => {
    const canvas = canvasRef.current;
    const container = previewContainerRef.current;
    const bgImg = bgImageRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cw = rect.width;
    const ch = rect.height;

    ctx.clearRect(0, 0, cw, ch);

    if (!bgImg || !bgImg.naturalWidth || !bgImg.naturalHeight) return;

    const iw = bgImg.naturalWidth;
    const ih = bgImg.naturalHeight;
    const scale = Math.min(cw / iw, ch / ih);
    const drawnW = iw * scale;
    const drawnH = ih * scale;
    const offsetX = (cw - drawnW) / 2;
    const offsetY = (ch - drawnH) / 2;

    const currentOverlays = overlaysRef.current;

    for (const overlay of currentOverlays) {
      if (!overlay.active || !overlay.layerSrc) continue;

      // Upload placeholder: the layer image is only used as a position source.
      // We draw the uploaded image directly and never fall back to drawing the
      // placeholder layer. If there is no upload, we skip the overlay entirely.
      if ("uploadSrc" in overlay) {
        if (!overlay.uploadSrc) continue;

        let uploadImg: HTMLImageElement;
        try {
          uploadImg = await loadImage(overlay.uploadSrc);
        } catch {
          continue;
        }

        let layerImg: HTMLImageElement;
        try {
          layerImg = await loadImage(overlay.layerSrc);
        } catch {
          continue;
        }

        await drawUploadIntoLayerBounds({
          canvas,
          ctx,
          layerImg,
          uploadImg,
          dpr,
          cw,
          ch,
          offsetX,
          offsetY,
          drawnW,
          drawnH,
        });
        continue;
      }

      // Tinted layers (stripes/branding) and static logos are drawn as-is.
      let layerImg: HTMLImageElement;
      try {
        layerImg = await loadImage(overlay.layerSrc);
      } catch {
        continue;
      }

      if (overlay.tintHex) {
        await drawTintedLayer({
          canvas,
          ctx,
          layerImg,
          tintHex: overlay.tintHex,
          dpr,
          cw,
          ch,
          offsetX,
          offsetY,
          drawnW,
          drawnH,
        });
      } else {
        ctx.globalCompositeOperation = "source-over";
        drawFitted({
          targetCtx: ctx,
          img: layerImg,
          offsetX,
          offsetY,
          drawnW,
          drawnH,
        });
      }
    }


    ctx.globalCompositeOperation = "source-over";
  }, [loadImage, canvasRef, previewContainerRef, bgImageRef]);

  const drawInProgress = useRef(false);
  const drawQueued = useRef(false);

  const draw = useCallback(async () => {
    if (drawInProgress.current) {
      drawQueued.current = true;
      return;
    }
    drawInProgress.current = true;

    try {
      do {
        drawQueued.current = false;
        await performDraw();
      } while (drawQueued.current);
    } finally {
      drawInProgress.current = false;
    }
  }, [performDraw]);

  useEffect(() => {
    draw();
    const handleResize = () => {
      draw();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw, overlays]);



  return { draw };
};
