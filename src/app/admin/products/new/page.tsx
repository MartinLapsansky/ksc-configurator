import React from "react";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/features/admin/components/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  });

  return <ProductForm categories={categories} />;
}