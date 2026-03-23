"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { ColorOption } from "../pickerComponents/ColorSwatchPicker";
import type { StaticLogoOption } from "../pickerComponents/StaticLogoPicker";

type JerseyPreviewProps = {
    bgColor: ColorOption;
    stripeColor: ColorOption;
    brandingColor: ColorOption;
    leftChestLogoUrl?: string;
    rightLogo?: StaticLogoOption;
    sponsorLogoUrl?: string;
};

const JerseyPreview: React.FC<JerseyPreviewProps> = ({
                                                         bgColor, sponsorLogoUrl,stripeColor,brandingColor,leftChestLogoUrl,rightLogo
                                                     }) => {
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const previewContainerRef = useRef<HTMLDivElement | null>(null);

    const overlayImageRef = useRef<HTMLImageElement | null>(null);


    const drawOverlay = useCallback(
        (hex: string) => {
            const canvas = overlayCanvasRef.current;
            const container = previewContainerRef.current;
            const overlayImage = overlayImageRef.current;
            if (!canvas || !container || !overlayImage || !overlayImage.complete) return;

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

            ctx.globalCompositeOperation = "multiply";
            drawContain(overlayImage);

            ctx.globalCompositeOperation = "destination-in";
            drawContain(overlayImage);

            ctx.globalCompositeOperation = "source-over";
        },
        [],
    );



    useEffect(() => {
        if (!overlayImageRef.current) {
            const img = new Image();
            img.src = "/assets/overlay.png"; // skontroluj, že overlay.png je v public/assets
            img.onload = () => {
                drawOverlay(stripeColor.hex);
            };
            overlayImageRef.current = img;
        } else if (overlayImageRef.current.complete) {
            // ak už bol načítaný skôr (napr. pri zmene farby)
            drawOverlay(stripeColor.hex);
        }
    }, [stripeColor.hex, drawOverlay]);



    useEffect(() => {
        const handleResize = () => {
            drawOverlay(stripeColor.hex);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [stripeColor.hex, drawOverlay]);



    const bgImageSrc = useMemo(() => {
    if (!bgColor.file) return "/assets/bg-hot-pink.jpg";
        return `/assets/${bgColor.file}`;
    }, [bgColor.file]);




    return (
        <div className="flex flex-1 items-center justify-center">
            <div
                ref={previewContainerRef}
                className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg bg-gray-200 shadow-md"
            >
                <img
                    src={bgImageSrc}
                    alt="Jersey base"
                    className="absolute inset-0 h-full w-full object-contain"
                />

                <canvas
                    ref={overlayCanvasRef}
                    className="absolute inset-0 h-full w-full"
                />

                <div
                    className="pointer-events-none absolute left-1/2 top-[30%] -translate-x-1/2 text-3xl font-extrabold tracking-widest"
                    style={{ color: brandingColor.hex }}
                >
                    KSC
                </div>

                {leftChestLogoUrl && (
                    <div className="pointer-events-none absolute left-[35%] top-[24%] h-10 w-10 -translate-x-1/2 -translate-y-1/2">
                        <img
                            src={leftChestLogoUrl}
                            alt="Left chest logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                )}

                {rightLogo && (
                    <div className="pointer-events-none absolute left-[65%] top-[24%] h-10 w-10 -translate-x-1/2 -translate-y-1/2">
                        <img
                            src={rightLogo.src}
                            alt={rightLogo.name}
                            className="h-full w-full object-contain"
                        />
                    </div>
                )}

                {sponsorLogoUrl && (
                    <div className="pointer-events-none absolute left-1/2 top-[48%] h-16 w-32 -translate-x-1/2 -translate-y-1/2">
                        <img
                            src={sponsorLogoUrl}
                            alt="Sponsor logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default JerseyPreview;