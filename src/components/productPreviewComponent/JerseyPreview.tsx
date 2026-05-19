"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ColorOption } from "../pickerComponents/ColorSwatchPicker";
import type { StaticLogoOption } from "../pickerComponents/StaticLogoPicker";
import type { BackLogoTextConfig } from "../pickerComponents/TextInsertPicker";

import stripeImgLayer from "../../app/assets/layers/front-stripes-layer.png";
import backStripeImgLayer from "../../app/assets/layers/back-stripes-layer.png";
import brandImg from "../../app/assets/layers/kcs-logo-layer.png";
import leftChestImg from "../../app/assets/layers/crest-logo-layer.png";
import rightLogoGaaImg from "../../app/assets/layers/gaa-logo-layer.png";
import rightLogoCamogieImg from "../../app/assets/layers/camogie-logo-layer.png";
import rightLogoLgfaImg from "../../app/assets/layers/lgfa-logo-layer.png";
import sponsorLogoImg from "../../app/assets/layers/sponsor-logo-layer.png";
import backSponsorLogoImg from "../../app/assets/layers/back-sponsor-logo-layer.png";

import SponsorTextOverlay from "@/components/productPreviewComponent/sponsorTextOverlay";

const RIGHT_LOGO_LAYER_MAP: Record<string, typeof rightLogoGaaImg> = {
  Gaa: rightLogoGaaImg,
  Camogie: rightLogoCamogieImg,
  Lgfa: rightLogoLgfaImg,
};

type OverlayEntry = {
  key: string;
  layerSrc: string;
  tintHex?: string;
  /** URL uploadnutého obrázka – vykreslí sa do oblasti layeru ako maska */
  uploadSrc?: string;
  active: boolean;
};

type JerseyPreviewProps = {
  bgColor: ColorOption;
  stripeColor: ColorOption;
  brandingColor: ColorOption;
  leftChestLogoUrl?: string;
  rightLogo?: StaticLogoOption;
  sponsorLogoUrl?: string;
  /** FRONT sponsor text */
  sponsorText?: BackLogoTextConfig;
  /** BACK sponsor logo (image) */
  backLogoUrl?: string;
  /** BACK sponsor text */
  backTextConfig?: BackLogoTextConfig;
};

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    const cached = imageCache.current.get(src);
    if (cached && cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageCache.current.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const overlays: OverlayEntry[] = useMemo(() => {
    const list: OverlayEntry[] = [];

    if (!isBackView) {
      // FRONT VIEW
      list.push({
        key: "front-stripes",
        layerSrc: stripeImgLayer.src,
        tintHex: stripeColor.hex,
        active: true,
      });

      list.push({
        key: "branding",
        layerSrc: brandImg.src,
        tintHex: brandingColor.hex,
        active: true,
      });

      list.push({
        key: "leftChest",
        layerSrc: leftChestImg.src,
        uploadSrc: leftChestLogoUrl,
        active: true,
      });

      const rightLayerImg = rightLogo?.name
        ? RIGHT_LOGO_LAYER_MAP[rightLogo.name]
        : undefined;
      list.push({
        key: "rightLogo",
        layerSrc: rightLayerImg?.src ?? "",
        active: !!rightLogo && !!rightLayerImg,
      });

      list.push({
        key: "sponsorLogoFront",
        layerSrc: sponsorLogoImg.src,
        uploadSrc: sponsorLogoUrl,
        active: true,
      });
    } else {
      // BACK VIEW
      list.push({
        key: "back-stripes",
        layerSrc: backStripeImgLayer.src,
        tintHex: stripeColor.hex,
        active: true,
      });

      list.push({
        key: "backSponsorLogo",
        layerSrc: backSponsorLogoImg.src,
        uploadSrc: backLogoUrl,
        active: true,
      });
    }

    return list;
  }, [
    isBackView,
    stripeColor.hex,
    brandingColor.hex,
    leftChestLogoUrl,
    rightLogo,
    sponsorLogoUrl,
    backLogoUrl,
  ]);

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    const container = previewContainerRef.current;
    const bgImg = bgImageRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

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

    const drawFitted = (
      targetCtx: CanvasRenderingContext2D,
      img: HTMLImageElement,
    ) => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      targetCtx.drawImage(img, offsetX, offsetY, drawnW, drawnH);
    };

    const drawUploadIntoLayerBounds = async (
      layerImg: HTMLImageElement,
      uploadImg: HTMLImageElement,
    ) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      offCtx.clearRect(0, 0, cw, ch);
      offCtx.globalCompositeOperation = "source-over";
      drawFitted(offCtx, layerImg);

      const fx = Math.round(offsetX * dpr);
      const fy = Math.round(offsetY * dpr);
      const fw = Math.round(drawnW * dpr);
      const fh = Math.round(drawnH * dpr);

      const imageData = offCtx.getImageData(fx, fy, fw, fh);
      const pixels = imageData.data;

      let minX = fw,
        minY = fh,
        maxX = 0,
        maxY = 0;
      for (let y = 0; y < fh; y++) {
        for (let x = 0; x < fw; x++) {
          const alpha = pixels[(y * fw + x) * 4 + 3];
          if (alpha > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX <= minX || maxY <= minY) return;

      const bx = offsetX + minX / dpr;
      const by = offsetY + minY / dpr;
      const bw = (maxX - minX + 1) / dpr;
      const bh = (maxY - minY + 1) / dpr;

      offCtx.clearRect(0, 0, cw, ch);

      const uiw = uploadImg.naturalWidth;
      const uih = uploadImg.naturalHeight;

      const uScale = Math.min(bw / uiw, bh / uih);
      const udw = uiw * uScale;
      const udh = uih * uScale;

      const ux = bx + (bw - udw) / 2;
      const uy = by + (bh - udh) / 2;

      offCtx.drawImage(uploadImg, ux, uy, udw, udh);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(offscreen, 0, 0);
      ctx.restore();
    };

    for (const overlay of overlays) {
      if (!overlay.active || !overlay.layerSrc) continue;

      let layerImg: HTMLImageElement;
      try {
        layerImg = await loadImage(overlay.layerSrc);
      } catch {
        continue;
      }

      if (overlay.uploadSrc) {
        let uploadImg: HTMLImageElement;
        try {
          uploadImg = await loadImage(overlay.uploadSrc);
        } catch {
          ctx.globalCompositeOperation = "source-over";
          drawFitted(ctx, layerImg);
          continue;
        }
        await drawUploadIntoLayerBounds(layerImg, uploadImg);
      } else if (overlay.tintHex) {
        const offscreen = document.createElement("canvas");
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const offCtx = offscreen.getContext("2d");
        if (!offCtx) continue;

        offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        offCtx.globalCompositeOperation = "source-over";
        drawFitted(offCtx, layerImg);

        offCtx.globalCompositeOperation = "source-in";
        offCtx.fillStyle = overlay.tintHex;
        offCtx.fillRect(0, 0, cw, ch);

        offCtx.globalCompositeOperation = "multiply";
        drawFitted(offCtx, layerImg);

        offCtx.globalCompositeOperation = "destination-in";
        drawFitted(offCtx, layerImg);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(offscreen, 0, 0);
        ctx.restore();
      } else {
        ctx.globalCompositeOperation = "source-over";
        drawFitted(ctx, layerImg);
      }
    }

    ctx.globalCompositeOperation = "source-over";
  }, [overlays, loadImage]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = () => {
      draw();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  // Base jersey image (front or back)
  const bgImageSrc = useMemo(() => {
    if (!bgColor.file && !bgColor.backFile) return "";

    const resolveSrc = (file?: string | { src: string }) => {
      if (!file) return "";
      return typeof file === "string" ? file : file.src;
    };

    // front
    if (!isBackView) {
      return resolveSrc(bgColor.file);
    }

    // back
    // if backFile is missing, gracefully fall back to front
    return resolveSrc(bgColor.backFile ?? bgColor.file);
  }, [bgColor, isBackView]);

  const activeSponsorText: BackLogoTextConfig | undefined = useMemo(() => {
    // Front view → show front text (sponsorText)
    if (!isBackView) {
      return sponsorText;
    }
    // Back view → prefer backTextConfig, fall back to front text if needed
    return backTextConfig ?? sponsorText;
  }, [isBackView, sponsorText, backTextConfig]);

  return (
    <div className="flex flex-col w-full h-[70vh]">
      <div
        ref={previewContainerRef}
        className="relative h-full w-full overflow-hidden rounded-lg shadow-md"
      >
        <img
          ref={bgImageRef}
          src={bgImageSrc}
          alt={isBackView ? "Jersey back base" : "Jersey front base"}
          className="absolute inset-0 h-full w-full object-contain md:object-contain"
          onLoad={() => draw()}
        />

        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 w-full h-full"
        />

        {activeSponsorText?.enabled && (
          <SponsorTextOverlay
            text={activeSponsorText.text}
            colorHex={activeSponsorText.color.hex}
            containerRef={previewContainerRef}
            bgImageRef={bgImageRef}
          />
        )}
      </div>

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