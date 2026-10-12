import React from "react";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/features/admin/components/CategoryForm";

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <CategoryForm categories={categories} />
    </div>
  );
}
