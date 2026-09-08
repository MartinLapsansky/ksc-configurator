"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { ProductDefinition } from "@/features/configurator/schemas/productDefinitionSchema";
import { ProductCanvas } from "@/components/ui/ProductCanvas";
import ProductFlipButton from "@/components/ui/ProductFlipButton";
import { buildOverlaysFromDefinition } from "@/features/configurator/utils/buildOverlaysFromDefinition";
import { resolveBaseImageSrc } from "@/features/configurator/utils/configurationValues";
import TextOverlay from "@/features/configurator/components/previews/TextOverlay";

type GenericProductPreviewProps = {
  productName: string;
  hasBackView: boolean;
  frontImageUrl: string | null;
  backImageUrl: string | null;
  definition: ProductDefinition;
  values: Record<string, unknown>;
};

/**
 * Data-driven product preview. Resolves the base image from the base-image
 * picker (or product fallback), builds overlays from the definition, and
 * renders any enabled text pickers at their configured position/view.
 */
const GenericProductPreview: React.FC<GenericProductPreviewProps> = ({
  productName,
  hasBackView,
  frontImageUrl,
  backImageUrl,
  definition,
  values,
}) => {
  const [isBackView, setIsBackView] = useState(false);

  const overlays = useMemo(
    () => buildOverlaysFromDefinition(definition, values, isBackView),
    [definition, values, isBackView],
  );

  const bgImageSrc = useMemo(
    () =>
      resolveBaseImageSrc(definition, values, isBackView, {
        frontImageUrl,
        backImageUrl,
      }),
    [definition, values, isBackView, frontImageUrl, backImageUrl],
  );

  const renderTexts = useCallback(() => {
    const view = isBackView ? "back" : "front";

    return definition.pickers
      .filter((picker) => picker.type === "text")
      .map((picker) => {
        const pickerView = picker.view ?? "front";
        if (pickerView !== view) return null;

        const value = values[picker.key] as
          | { enabled?: boolean; text?: string; color?: { hex?: string } }
          | undefined;

        if (!value?.enabled || !value.text) return null;

        const position = picker.position ?? { x: 0.49, y: 0.54 };

        return (
          <TextOverlay
            key={picker.key}
            text={value.text}
            colorHex={value.color?.hex ?? "#000000"}
            position={position}
          />
        );
      });
  }, [definition.pickers, values, isBackView]);

  return (
    <div className="flex flex-col w-full h-[70vh]">
      <ProductCanvas
        bgImageSrc={bgImageSrc}
        overlays={overlays}
        bgImageAlt={
          isBackView ? `${productName} back base` : `${productName} front base`
        }
      >
        {renderTexts()}
      </ProductCanvas>

      {hasBackView && (
        <ProductFlipButton
          isBackView={isBackView}
          onToggle={() => setIsBackView((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default GenericProductPreview;