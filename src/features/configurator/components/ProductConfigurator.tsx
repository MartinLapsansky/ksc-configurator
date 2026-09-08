"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { ProductConfig } from "@/types/preview";
import type { CatalogProduct } from "@/features/configurator/types";
import ProductItemLayout from "@/features/configurator/components/ProductItemLayout";
import ProductConfiguratorPickers from "@/features/configurator/components/ProductConfiguratorPickers";
import GenericProductPreview from "@/features/configurator/components/previews/GenericProductPreview";
import { buildDefaultValues } from "@/features/configurator/utils/configurationValues";

type ProductConfiguratorProps = {
  product: CatalogProduct;
};

/**
 * Universal data-driven configurator. Accepts a serialised catalog product and
 * renders pickers + preview from its `definition`, replacing the previous
 * per-product `*ProductItem` screens.
 */
const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({
  product,
}) => {
  const { addItem, openBag } = useCart();

  const [values, setValues] = useState<Record<string, unknown>>(() =>
    buildDefaultValues(product.definition),
  );

  const handlePickerChange = useCallback((key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAddToBag = useCallback(() => {
    const config: ProductConfig = {
      productId: product.id,
      productType: product.slug,
      productName: product.name,
      values,
      definitionSnapshot: product.definition,
    };

    addItem(config);
    openBag();
  }, [addItem, openBag, product, values]);

  const totalDots = useMemo(
    () => Math.max(1, product.definition.pickers.length),
    [product.definition.pickers.length],
  );

  return (
    <ProductItemLayout
      title={product.name}
      totalDots={totalDots}
      onAddToBag={handleAddToBag}
      pickers={
        <ProductConfiguratorPickers
          definition={product.definition}
          values={values}
          onChange={handlePickerChange}
        />
      }
      preview={
        <GenericProductPreview
          productName={product.name}
          hasBackView={product.hasBackView}
          frontImageUrl={product.frontImageUrl}
          backImageUrl={product.backImageUrl}
          definition={product.definition}
          values={values}
        />
      }
    />
  );
};

export default ProductConfigurator;