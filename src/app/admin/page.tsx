import React from "react";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/features/admin/components/AdminDashboard";

export default async function AdminDashboardPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        _count: { select: { children: true, products: true } },
      },
    }),
    prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
  ]);

  return <AdminDashboard categories={categories} products={products} />;
}