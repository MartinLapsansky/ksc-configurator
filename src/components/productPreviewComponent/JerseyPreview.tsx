"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColorOption } from "../pickerComponents/ColorSwatchPicker";
import type { StaticLogoOption } from "../pickerComponents/StaticLogoPicker";
import type { BackLogoTextConfig } from "../pickerComponents/TextInsertPicker";

import overlayImg from "../../app/assets/overlay.png";

const DESIGN_POSITIONS = {
    branding: { x: 0.31, y: 0.30 },
    leftChest: { x: 0.38, y: 0.32 },
    rightChest: { x: 0.25, y: 0.32 },
    sponsor: { x: 0.31, y: 0.40 },
    sponsorText: {x: 0.31,y: 0.47},
    backSponsor: { x: 0.69, y: 0.30 },
    backSponsorText: { x: 0.70, y: 0.37 },
};

type LogoPositions = {
    branding: { left: number; top: number };
    leftChest: { left: number; top: number };
    rightChest: { left: number; top: number };
    sponsor: { left: number; top: number };
    sponsorText: {left: number; top: number};
    backSponsor: { left: number; top: number };
    backSponsorText: { left: number; top: number };
};

type JerseyPreviewProps = {
  bgColor: ColorOption;
  stripeColor: ColorOption;
  brandingColor: ColorOption;
  leftChestLogoUrl?: string;
  rightLogo?: StaticLogoOption;
  sponsorLogoUrl?: string;
  sponsorText?: BackLogoTextConfig;
  backLogoUrl?: string;
  backSponsorText?: BackLogoTextConfig;
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
  backSponsorText
}) => {


  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const overlayImageRef = useRef<HTMLImageElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  const [logoPositions, setLogoPositions] = useState<LogoPositions | null>(null);


    const drawOverlay = useCallback((hex: string) => {
    const canvas = overlayCanvasRef.current;
    const container = previewContainerRef.current;
    const overlayImage = overlayImageRef.current;

    if (!canvas || !container || !overlayImage || !overlayImage.complete) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // vyplnenie farbou pruhov
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, w, h);

    const drawContain = (img: HTMLImageElement) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;

      const s = Math.min(w / iw, h / ih);
      const dw = iw * s;
      const dh = ih * s;
      const x = (w - dw) / 2;
      const y = (h - dh) / 2;

      ctx.drawImage(img, x, y, dw, dh);
    };

    // multiply overlay textúra
    ctx.globalCompositeOperation = "multiply";
    drawContain(overlayImage);

    // orezať do tvaru overlayu
    ctx.globalCompositeOperation = "destination-in";
    drawContain(overlayImage);

    ctx.globalCompositeOperation = "source-over";
  }, []);


    // Funkcia, ktorá prepočíta pozície log podľa veľkosti kontajnera & obrázka

    const recalcLogoPositions = useCallback(() => {
        const container = previewContainerRef.current;
        const bgImg = bgImageRef.current;

        if (!container || !bgImg || !bgImg.naturalWidth || !bgImg.naturalHeight) {
            return;
        }

        const rect = container.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        const iw = bgImg.naturalWidth;
        const ih = bgImg.naturalHeight;

        // rovnaká logika ako "object-contain"
        const s = Math.min(w / iw, h / ih);
        const drawnWidth = iw * s;
        const drawnHeight = ih * s;
        const offsetX = (w - drawnWidth) / 2;
        const offsetY = (h - drawnHeight) / 2;

        const makePos = (xNorm: number, yNorm: number) => {
            const xPx = offsetX + xNorm * drawnWidth;
            const yPx = offsetY + yNorm * drawnHeight;
            return {
                left: (xPx / w) * 100,
                top: (yPx / h) * 100,
            };
        };

        setLogoPositions({
            branding: makePos(DESIGN_POSITIONS.branding.x, DESIGN_POSITIONS.branding.y),
            leftChest: makePos(DESIGN_POSITIONS.leftChest.x, DESIGN_POSITIONS.leftChest.y),
            rightChest: makePos(DESIGN_POSITIONS.rightChest.x, DESIGN_POSITIONS.rightChest.y),
            sponsor: makePos(DESIGN_POSITIONS.sponsor.x, DESIGN_POSITIONS.sponsor.y),
            sponsorText: makePos(DESIGN_POSITIONS.sponsorText.x, DESIGN_POSITIONS.sponsorText.y),
            backSponsor: makePos(DESIGN_POSITIONS.backSponsor.x, DESIGN_POSITIONS.backSponsor.y),
            backSponsorText: makePos(DESIGN_POSITIONS.backSponsorText.x, DESIGN_POSITIONS.backSponsorText.y),
        });
    }, []);
  

  // inicializácia overlay obrázka + prvé vykreslenie
  useEffect(() => {
    if (!overlayImageRef.current) {
      const img = new Image();
      img.src = overlayImg.src; // použitie importu
      img.onload = () => {
        drawOverlay(stripeColor.hex);
      };
      overlayImageRef.current = img;
    } else if (overlayImageRef.current.complete) {
      drawOverlay(stripeColor.hex);
    }
  }, [stripeColor.hex, drawOverlay]);



  // pri zmene veľkosti okna prerenderuj overlay
  useEffect(() => {
    const handleResize = () => {
      drawOverlay(stripeColor.hex);
      recalcLogoPositions();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [stripeColor.hex, drawOverlay,recalcLogoPositions]);



  // výber správneho src pre základný dres (z ColorOption.file)
  const bgImageSrc = useMemo(() => {
    if (!bgColor.file) return "";
    if (typeof bgColor.file === "string") {
      return bgColor.file;
    }
    return bgColor.file.src;
  }, [bgColor.file]);
  
  
  

      return (
        <div className="flex flex-col w-full h-[70vh]">
          <div
            ref={previewContainerRef}
            className="relative h-full w-full overflow-hidden rounded-lg bg-gray-200 shadow-md"
          >
            {/* základný dres */}
            <img
              ref={bgImageRef}
              src={bgImageSrc}
              alt="Jersey base"
              className="absolute inset-0 h-full w-full object-contain md:object-contain"
              onLoad={() => {
                drawOverlay(stripeColor.hex);
                recalcLogoPositions();
              }}
            />

            {/* canvas pre pruhy / overlay */}
            <canvas
              ref={overlayCanvasRef}
              className="pointer-events-none absolute inset-0 w-full h-full"
            />

            {/* KSC branding text – stred hrude na prednej (ľavej) polovici */}
            {logoPositions && (
              <div
                className="pointer-events-none absolute text-xl font-extrabold tracking-widest -translate-x-1/2 -translate-y-1/2"
                style={{
                  color: brandingColor.hex,
                  left: `${logoPositions.branding.left}%`,
                  top: `${logoPositions.branding.top}%`,
                }}
              >
                KSC
              </div>
            )}

        {/* ľavé logo na hrudi – trochu viac k “ľavému ramenu” na prednej polovici */}
          {leftChestLogoUrl && logoPositions && (
              <div
                  className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2"
                  style={{
                      left: `${logoPositions.leftChest.left}%`,
                      top: `${logoPositions.leftChest.top}%`,
                  }}
              >
                  <img
                      src={leftChestLogoUrl}
                      alt="Left chest logo"
                      className="h-full w-full object-contain"
                  />
              </div>
          )}

        {/* pravé logo na hrudi – smerom k “pravému ramenu” na prednej polovici */}
          {rightLogo && logoPositions && (
              <div
                  className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2"
                  style={{
                      left: `${logoPositions.rightChest.left}%`,
                      top: `${logoPositions.rightChest.top}%`,
                  }}
              >
                  <img
                      src={rightLogo.src}
                      alt={rightLogo.name}
                      className="h-full w-full object-contain"
                  />
              </div>
          )}

        {/* sponzor v strede predku – stred prednej polovice */}
          {sponsorLogoUrl && logoPositions && (
              <div
                  className="pointer-events-none absolute h-16 w-32 -translate-x-1/2 -translate-y-1/2"
                  style={{
                      left: `${logoPositions.sponsor.left}%`,
                      top: `${logoPositions.sponsor.top}%`,
                  }}
              >
                  <img
                      src={sponsorLogoUrl}
                      alt="Sponsor logo"
                      className="h-full w-full object-contain"
                  />
              </div>
          )}

          {logoPositions && sponsorText?.enabled && (
              <div
                  className="pointer-events-none absolute text-xl font-extrabold tracking-widest -translate-x-1/2 -translate-y-1/2"
                  style={{
                      color: sponsorText.color.hex,
                      left: `${logoPositions.sponsorText.left}%`,
                      top: `${logoPositions.sponsorText.top}%`,
                  }}
              >

                  {sponsorText.text}
              </div>
          )}


          {/*logo na vrchu zadnej strany dresu */}
          {backLogoUrl && logoPositions && (
              <div
                  className="pointer-events-none absolute h-16 w-32 -translate-x-1/2 -translate-y-1/2"
                  style={{
                      left: `${logoPositions.backSponsor.left}%`,
                      top: `${logoPositions.backSponsor.top}%`,
                  }}
              >
                  <img
                      src={backLogoUrl}
                      alt="Sponsor logo"
                      className="h-full w-full object-contain"
                  />
              </div>
              )
          }
          {logoPositions && backSponsorText?.enabled && (
              <div
                  className="pointer-events-none absolute text-xl font-extrabold tracking-widest -translate-x-1/2 -translate-y-1/2"
                  style={{
                      color: backSponsorText.color.hex,
                      left: `${logoPositions.backSponsorText.left}%`,
                      top: `${logoPositions.backSponsorText.top}%`,
                  }}
              >

                  {backSponsorText.text}
              </div>
          )}

      </div>

        <div className="flex">
            <button className="flex border-2 text-white bg-gray-500"></button>
        </div>
    </div>
  );
};

export default JerseyPreview;