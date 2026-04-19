
"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { ColorOption } from "../pickerComponents/ColorSwatchPicker";
import type { StaticLogoOption } from "../pickerComponents/StaticLogoPicker";
import type { BackLogoTextConfig } from "../pickerComponents/TextInsertPicker";

import stripeImgLayer from "../../app/assets/layers/front-stripes-layer.png";
import brandImg from "../../app/assets/layers/kcs-logo-layer.png";
import leftChestImg from "../../app/assets/layers/crest-logo-layer.png";
import rightLogoGaaImg from "../../app/assets/layers/gaa-logo-layer.png";
import rightLogoCamogieImg from "../../app/assets/layers/camogie-logo-layer.png";
import rightLogoLgfaImg from "../../app/assets/layers/lgfa-logo-layer.png";
import sponsorLogoImg from "../../app/assets/layers/sponsor-logo-layer.png";

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
    sponsorText?: BackLogoTextConfig;
};

const JerseyPreview: React.FC<JerseyPreviewProps> = ({
                                                         bgColor,
                                                         stripeColor,
                                                         brandingColor,
                                                         leftChestLogoUrl,
                                                         rightLogo,
                                                         sponsorLogoUrl,
                                                         sponsorText,
                                                     }) => {
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

        // 1) Pruhy – tintované
        list.push({
            key: "stripes",
            layerSrc: stripeImgLayer.src,
            tintHex: stripeColor.hex,
            active: true,
        });

        // 2) KCS branding – tintované
        list.push({
            key: "branding",
            layerSrc: brandImg.src,
            tintHex: brandingColor.hex,
            active: true,
        });

        // 3) Left chest – vždy aktívny, s uploadom alebo bez
        list.push({
            key: "leftChest",
            layerSrc: leftChestImg.src,
            uploadSrc: leftChestLogoUrl,
            active: true,
        });

        // 4) Right logo
        const rightLayerImg = rightLogo?.name
            ? RIGHT_LOGO_LAYER_MAP[rightLogo.name]
            : undefined;
        list.push({
            key: "rightLogo",
            layerSrc: rightLayerImg?.src ?? "",
            active: !!rightLogo && !!rightLayerImg,
        });

        // 5) Sponsor logo – vždy aktívny, s uploadom alebo bez
        list.push({
            key: "sponsorLogo",
            layerSrc: sponsorLogoImg.src,
            uploadSrc: sponsorLogoUrl,
            active: true,
        });

        return list;
    }, [
        stripeColor.hex,
        brandingColor.hex,
        leftChestLogoUrl,
        rightLogo,
        sponsorLogoUrl,
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

        /**
         * Vykreslí uploadnutý obrázok do bounding boxu nepriehľadných pixelov layeru.
         * Layer slúži ako maska – uploadnutý obrázok sa orezáva do tvaru layeru.
         */
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

            // 1) nakreslíme layer iba na analýzu bounding boxu
            offCtx.clearRect(0, 0, cw, ch);
            offCtx.globalCompositeOperation = "source-over";
            drawFitted(offCtx, layerImg);

            // 2) zisti bounding box nepriehľadných pixelov
            const fx = Math.round(offsetX * dpr);
            const fy = Math.round(offsetY * dpr);
            const fw = Math.round(drawnW * dpr);
            const fh = Math.round(drawnH * dpr);

            const imageData = offCtx.getImageData(fx, fy, fw, fh);
            const pixels = imageData.data;

            let minX = fw, minY = fh, maxX = 0, maxY = 0;
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

            // 3) prepočítaj bounding box do CSS súradníc
            const bx = offsetX + minX / dpr;
            const by = offsetY + minY / dpr;
            const bw = (maxX - minX + 1) / dpr;
            const bh = (maxY - minY + 1) / dpr;

            // 4) vymaž offscreen canvas (už nechceme vidieť overlay)
            offCtx.clearRect(0, 0, cw, ch);

            // 5) nakresli upload do bounding boxu overlayu (object-contain)
            const uiw = uploadImg.naturalWidth;
            const uih = uploadImg.naturalHeight;

            const uScale = Math.min(bw / uiw, bh / uih);
            const udw = uiw * uScale;
            const udh = uih * uScale;

            const ux = bx + (bw - udw) / 2;
            const uy = by + (bh - udh) / 2;

            offCtx.drawImage(uploadImg, ux, uy, udw, udh);

            // 6) prenes výsledok na hlavný canvas
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
                // Má upload – vykreslíme uploadnutý obrázok do masky layeru
                let uploadImg: HTMLImageElement;
                try {
                    uploadImg = await loadImage(overlay.uploadSrc);
                } catch {
                    // Upload sa nepodaril načítať – zobrazíme layer placeholder
                    ctx.globalCompositeOperation = "source-over";
                    drawFitted(ctx, layerImg);
                    continue;
                }
                drawUploadIntoLayerBounds(layerImg, uploadImg);
            } else if (overlay.tintHex) {
                // Tintovaný overlay
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
                // Netintovaný overlay – layer priamo
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
        const handleResize = () => { draw(); };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [draw]);

    const bgImageSrc = useMemo(() => {
        if (!bgColor.file) return "";
        if (typeof bgColor.file === "string") return bgColor.file;
        return bgColor.file.src;
    }, [bgColor.file]);

    return (
        <div className="flex flex-col w-full h-[70vh]">
            <div
                ref={previewContainerRef}
                className="relative h-full w-full overflow-hidden rounded-lg shadow-md"
            >
                <img
                    ref={bgImageRef}
                    src={bgImageSrc}
                    alt="Jersey base"
                    className="absolute inset-0 h-full w-full object-contain md:object-contain"
                    onLoad={() => draw()}
                />

                <canvas
                    ref={canvasRef}
                    className="pointer-events-none absolute inset-0 w-full h-full"
                />

                {sponsorText?.enabled && (
                    <SponsorTextOverlay
                        text={sponsorText.text}
                        colorHex={sponsorText.color.hex}
                        containerRef={previewContainerRef}
                        bgImageRef={bgImageRef}
                    />
                )}
            </div>

            <div className="flex">
                <button className="flex border-2 text-white bg-gray-500"></button>
            </div>
        </div>
    );
};

export default JerseyPreview;