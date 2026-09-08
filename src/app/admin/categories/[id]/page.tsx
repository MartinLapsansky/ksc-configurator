import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/features/admin/components/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
  ]);

  if (!category) notFound();

  return (
    <CategoryForm
      categories={categories}
      initial={{
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        sortOrder: category.sortOrder,
        active: category.active,
      }}
    />
  );
}