"use client";

import React, { createContext, useContext, useState } from "react";
import type { ProductConfig } from "@/types/preview";

interface ProductConfigContextValue {
  config: ProductConfig | null;
  setConfig: (config: ProductConfig) => void;
}

const ProductConfigContext = createContext<ProductConfigContextValue | undefined>(
  undefined,
);

export const ProductConfigProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [config, setConfig] = useState<ProductConfig | null>(null);

  return (
    <ProductConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ProductConfigContext.Provider>
  );
};

export const useProductConfig = (): ProductConfigContextValue => {
  const ctx = useContext(ProductConfigContext);
  if (!ctx) {
    throw new Error("useProductConfig must be used within ProductConfigProvider");
  }
  return ctx;
};
