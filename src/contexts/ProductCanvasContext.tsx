"use client";

import React, { createContext, useContext } from "react";

export type ProductCanvasContextValue = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bgImageRef: React.RefObject<HTMLImageElement | null>;
};

const ProductCanvasContext = createContext<ProductCanvasContextValue | null>(null);

export const ProductCanvasContextProvider = ProductCanvasContext.Provider;


export const useProductCanvasContext = () => {
  const context = useContext(ProductCanvasContext);
  if (context === null) {
    throw new Error("useProductCanvasContext must be used within ProductCanvasContextProvider");
  }
  return context;
};
