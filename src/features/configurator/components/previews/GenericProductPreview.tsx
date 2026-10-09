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
  // TODO (challenge): deklaruj state, dva useMemo a jeden useCallback.
  //
  // 1. State:
  //      const [isBackView, setIsBackView] = useState(false);
  //    (drží, či sa zobrazuje predná alebo zadná strana produktu.)

    const [isBackView, setIsBackView] = useState(false);

    const overlays = useMemo(() => buildOverlaysFromDefinition(definition,values,isBackView),
        [definition,values,isBackView]);


  // 3. useMemo `bgImageSrc`:
  //      const bgImageSrc = useMemo(
  //        () =>
  //          resolveBaseImageSrc(definition, values, isBackView, {
  //            frontImageUrl,
  //            backImageUrl,
  //          }),
  //        [definition, values, isBackView, frontImageUrl, backImageUrl],
  //      );

    const bgImageSrc = useMemo(() => resolveBaseImageSrc(definition, values, isBackView, {
        frontImageUrl,
        backImageUrl,
      }), [definition, values, isBackView, frontImageUrl, backImageUrl]);


  //
  // 4. useCallback `renderTexts` — vráti pole <TextOverlay /> pre textové pickery:
  //    - `view = isBackView ? "back" : "front"`
  //    - prejdi `definition.pickers`, vyfiltruj tie s `picker.type === "text"`,
  //    - preskoč tie, ktorých `picker.view ?? "front"` sa nerovná `view`,
  //    - hodnota z `values[picker.key]` má typ:
  //        { enabled?: boolean; text?: string; color?: { hex?: string } } | undefined
  //    - ak `!value?.enabled || !value.text`, vráť null,
  //    - `position = picker.position ?? { x: 0.49, y: 0.54 }`,
  //    - vráť:
  //        <TextOverlay key={picker.key} text={value.text}
  //          colorHex={value.color?.hex ?? "#000000"} position={position} />
  //    - dependency pole: `[definition.pickers, values, isBackView]`

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
                        <TextOverlay key={picker.key} text={value.text} colorHex={value.color?.hex ?? '#000000'} position={position}/>
                    )
            })
    }, [definition.pickers, values, isBackView])

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