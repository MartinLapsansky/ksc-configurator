"use client";

import React, { createContext, useContext } from "react";

export type ProductCanvasContextValue = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bgImageRef: React.RefObject<HTMLImageElement | null>;
};

const ProductCanvasContext = createContext<ProductCanvasContextValue | null>(
  null,
);

export function ProductCanvasContextProvider({
  value,
  children,
}: {
  value: ProductCanvasContextValue;
  children: React.ReactNode;
}) {
  return (
    <ProductCanvasContext.Provider value={value}>
      {children}
    </ProductCanvasContext.Provider>
  );
}

export const useProductCanvasContext = () => {
  const context = useContext(ProductCanvasContext);
  if (!context) {
    throw new Error(
      "useProductCanvasContext must be used within ProductCanvasContextProvider",
    );
  }
  return context;
};