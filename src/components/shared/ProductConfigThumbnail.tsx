"use client";

import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import type { ProductConfig } from "@/types/preview";
import { getThumbnail } from "@/lib/cart";
import { ProductCanvas } from "@/components/ui/ProductCanvas";
import { buildOverlaysFromDefinition } from "@/features/configurator/utils/buildOverlaysFromDefinition";
import { resolveBaseImageSrc } from "@/features/configurator/utils/configurationValues";

type ProductConfigThumbnailProps = {
  config: ProductConfig;
  sizeClassName?: string;
};

const ProductConfigThumbnail: React.FC<ProductConfigThumbnailProps> = ({
  config,
  sizeClassName = "h-14 w-14",
}) => {
  const definition = config.definitionSnapshot;
  const values = config.values;

  if (definition && values) {
    const bgImageSrc = resolveBaseImageSrc(definition, values, false);

    if (bgImageSrc) {
      const overlays = buildOverlaysFromDefinition(definition, values, false);

      return (
        <div
          className={`relative ${sizeClassName} shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white`}
        >
          <ProductCanvas
            bgImageSrc={bgImageSrc}
            overlays={overlays}
            bgImageAlt={config.productName}
            className="relative h-full w-full overflow-hidden"
            canvasClassName="pointer-events-none absolute inset-0 h-full w-full"
            priority={false}
          />
        </div>
      );
    }
  }

  const thumbnail = getThumbnail(config);

  if (thumbnail) {
    return (
      <div
        className={`relative ${sizeClassName} shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white`}
      >
        <Image
          src={thumbnail}
          alt={config.productName}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex ${sizeClassName} shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400`}
    >
      <FontAwesomeIcon icon={faBagShopping} className="h-5 w-5" />
    </div>
  );
};

export default ProductConfigThumbnail;