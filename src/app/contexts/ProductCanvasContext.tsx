"use client";

import React, { useCallback, useRef, createContext, useContext, useEffect } from "react";
import Image from "next/image";
import type { OverlayEntry } from "@/types/preview";
import { useProductCanvas } from "@/app/hooks/useProductCanvas";

type ProductCanvasContextValue = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bgImageRef: React.RefObject<HTMLImageElement | null>;
};

const ProductCanvasContext = createContext<ProductCanvasContextValue | null>(null);

export const useProductCanvasContext = () => {
  const context = useContext(ProductCanvasContext);
  if (!context) {
    throw new Error("useProductCanvasContext must be used within ProductCanvasContext");
  }
  return context;
};

type ProductCanvasProps = {
  bgImageSrc: string;
  overlays: OverlayEntry[];
  bgImageAlt?: string;
  onImageLoadAction?: () => void;
  className?: string;
  canvasClassName?: string;
  children?: React.ReactNode;
};

/**
 * Maximum number of decoded images kept in the in-memory cache. Bounding this
 * prevents unbounded memory growth when navigating between categories/pages,
 * which on mobile can trigger "page crashed".
 */
const MAX_CACHE_SIZE = 20;

export const ProductCanvas: React.FC<ProductCanvasProps> = ({
  bgImageSrc,
  overlays,
  bgImageAlt = "Product base",
  onImageLoadAction,
  className = "relative h-full w-full overflow-hidden rounded-lg shadow-md",
  canvasClassName = "pointer-events-none absolute inset-0 w-full h-full",
  children,
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
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Evict oldest entries if the cache grows too large.
        if (imageCache.current.size >= MAX_CACHE_SIZE) {
          const oldestKey = imageCache.current.keys().next().value;
          if (oldestKey !== undefined) {
            imageCache.current.delete(oldestKey);
          }
        }
        imageCache.current.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  // Clear the image cache when the component unmounts so decoded images are
  // released when navigating away (prevents memory accumulation).
  useEffect(() => {
    const cache = imageCache.current;
    return () => {
      cache.clear();
    };
  }, []);


  const { draw } = useProductCanvas({
    overlays,
    loadImage,
    canvasRef,
    previewContainerRef,
    bgImageRef,
  });

  const handleImageLoad = () => {
    void draw();
    onImageLoadAction?.();
  };

  const contextValue = {
    containerRef: previewContainerRef,
    bgImageRef,
  };

  return (
    <ProductCanvasContext.Provider value={contextValue}>
      <div ref={previewContainerRef} className={className}>
        <Image
          ref={bgImageRef}
          src={bgImageSrc}
          alt={bgImageAlt}
          fill
          className="object-contain"
          onLoad={handleImageLoad}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        <canvas ref={canvasRef} className={canvasClassName} />

        {children}
      </div>
    </ProductCanvasContext.Provider>
  );
};
