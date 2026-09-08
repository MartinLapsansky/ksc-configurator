import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { productDefinitionSchema } from "@/features/configurator/schemas/productDefinitionSchema";
import ProductForm from "@/features/admin/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
  ]);

  if (!product) notFound();

  const parsed = productDefinitionSchema.safeParse(product.definition);

  return (
    <ProductForm
      categories={categories}
      initial={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId,
        active: product.active,
        sortOrder: product.sortOrder,
        hasBackView: product.hasBackView,
        frontImageUrl: product.frontImageUrl,
        backImageUrl: product.backImageUrl,
        definition: parsed.success
          ? parsed.data
          : { version: 1, pickers: [], overlays: { front: [] } },
      }}
    />
  );
}