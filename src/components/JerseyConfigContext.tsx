"use client";

import React, { createContext, useContext, useState } from "react";
import type { ColorOption } from "./pickerComponents/ColorSwatchPicker";
import type { StaticLogoOption } from "./pickerComponents/StaticLogoPicker";
import type { BackLogoTextConfig } from "./pickerComponents/TextInsertPicker";

export interface JerseyConfig {
  bgColor: ColorOption;
  stripeColor: ColorOption;
  brandingColor: ColorOption;
  leftChestLogoUrl?: string;
  sponsorLogoUrl?: string;
  rightLogo: StaticLogoOption;
  backLogoUrl?: string;
  backTextConfig: BackLogoTextConfig;
  frontTextConfig: BackLogoTextConfig;
}

interface JerseyConfigContextValue {
  config: JerseyConfig | null;
  setConfig: (config: JerseyConfig) => void;
}

const JerseyConfigContext = createContext<JerseyConfigContextValue | undefined>(
  undefined,
);

export const JerseyConfigProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [config, setConfig] = useState<JerseyConfig | null>(null);

  return (
    <JerseyConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </JerseyConfigContext.Provider>
  );
};

export const useJerseyConfig = (): JerseyConfigContextValue => {
  const ctx = useContext(JerseyConfigContext);
  if (!ctx) {
    throw new Error("useJerseyConfig must be used within JerseyConfigProvider");
  }
  return ctx;
};