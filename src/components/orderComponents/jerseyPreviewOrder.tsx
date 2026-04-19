"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { JerseyConfig } from "@/types/preview";

import jerseyHotPinkImg from "../../app/assets/jerseys/jersey-hot-pink.png";
import jerseyLavenderImg from "../../app/assets/jerseys/jersey-levender.png";
import jerseyLimeGreenImg from "../../app/assets/jerseys/jersey-lime-green.png";
import jerseyPurpleImg from "../../app/assets/jerseys/jersey-purple.png";

import stripeImgLayer from "../../app/assets/layers/front-stripes-layer.png";
import brandImg from "../../app/assets/layers/kcs-logo-layer.png";
import leftChestImg from "../../app/assets/layers/crest-logo-layer.png";
import rightLogoGaaImg from "../../app/assets/layers/gaa-logo-layer.png";
import rightLogoCamogieImg from "../../app/assets/layers/camogie-logo-layer.png";
import rightLogoLgfaImg from "../../app/assets/layers/lgfa-logo-layer.png";
import sponsorLogoImg from "../../app/assets/layers/sponsor-logo-layer.png";



type OverlayEntry = {
    key: string;
    layerSrc: string;
    tintHex?: string;
    uploadSrc?: string;
    active: boolean;
};

const RIGHT_LOGO_LAYER_MAP: Record<string, typeof rightLogoGaaImg> = {
    Gaa: rightLogoGaaImg,
    Camogie: rightLogoCamogieImg,
    Lgfa: rightLogoLgfaImg,
};

const BASE_JERSEY_BY_NAME: Record<string, string> = {
    Pink: jerseyHotPinkImg.src,
    Purple: jerseyPurpleImg.src,
    Lavender: jerseyLavenderImg.src,
    "Pastel green": jerseyLimeGreenImg.src,
};

type JerseyPreviewOrderProps = {
    jerseyConfig: JerseyConfig;
};

export default function JerseyPreviewOrder({
                                               jerseyConfig,
                                           }: JerseyPreviewOrderProps) {
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

    const baseJerseySrc = useMemo(() => {
        const name = jerseyConfig.bgColor?.name?.trim();
        return (name ? BASE_JERSEY_BY_NAME[name] : undefined) ?? jerseyPurpleImg.src;
    }, [jerseyConfig.bgColor]);

    const overlays: OverlayEntry[] = useMemo(() => {
        const list: OverlayEntry[] = [];

        list.push({
            key: "stripes",
            layerSrc: stripeImgLayer.src,
            tintHex: jerseyConfig.stripeColor?.hex,
            active: true,
        });

        list.push({
            key: "branding",
            layerSrc: brandImg.src,
            tintHex: jerseyConfig.brandingColor?.hex,
            active: true,
        });

        list.push({
            key: "leftChest",
            layerSrc: leftChestImg.src,
            uploadSrc: jerseyConfig.leftChestLogoUrl,
            active: true,
        });

        const rightLayerImg = jerseyConfig.rightLogo?.name
            ? RIGHT_LOGO_LAYER_MAP[jerseyConfig.rightLogo.name]
            : undefined;

        list.push({
            key: "rightLogo",
            layerSrc: rightLayerImg?.src ?? "",
            active: !!jerseyConfig.rightLogo && !!rightLayerImg,
        });

        list.push({
            key: "sponsorLogo",
            layerSrc: sponsorLogoImg.src,
            uploadSrc: jerseyConfig.sponsorLogoUrl,
            active: true,
        });

        return list;
    }, [jerseyConfig]);

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

        const drawFitted = (
            targetCtx: CanvasRenderingContext2D,
            img: HTMLImageElement,
        ) => {
            if (!img.naturalWidth || !img.naturalHeight) return;
            targetCtx.drawImage(img, offsetX, offsetY, drawnW, drawnH);
        };


        if (!bgImg || !bgImg.naturalWidth || !bgImg.naturalHeight) return;

        ctx.drawImage(bgImg, 0, 0, cw, ch);

        const iw = bgImg.naturalWidth;
        const ih = bgImg.naturalHeight;
        const scale = Math.min(cw / iw, ch / ih);
        const drawnW = iw * scale;
        const drawnH = ih * scale;
        const offsetX = (cw - drawnW) / 2;
        const offsetY = (ch - drawnH) / 2;



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
    }, [loadImage, overlays]);

    useEffect(() => {
        const bg = new Image();
        bg.src = baseJerseySrc;
        bg.onload = () => {
            bgImageRef.current = bg;
            void draw();
        };
        bgImageRef.current = bg;
    }, [baseJerseySrc, draw]);

    useEffect(() => {
        void draw();
    }, [draw, jerseyConfig]);

    return (
        <div className="w-full">
            <div
                ref={previewContainerRef}
                className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl bg-slate-50"
            >
                <canvas ref={canvasRef} className="h-full w-full" />
            </div>
        </div>
    );
}