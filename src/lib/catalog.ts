import { prisma } from "@/lib/prisma";
import { productDefinitionSchema } from "@/features/configurator/schemas/productDefinitionSchema";
import type { CatalogProduct } from "@/features/configurator/types";

/**
 * Server-side catalogue access layer. Categories and products are stored in
 * PostgreSQL and consumed by the dynamic `[...slug]` route and listing pages.
 */

export type CatalogCardItem = {
  id: string;
  title: string;
  buttonLabel: string;
  href: string;
};

export async function getTopLevelCategories(): Promise<CatalogCardItem[]> {
  const categories = await prisma.category.findMany({
    where: { parentId: null, active: true },
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((category) => ({
    id: category.id,
    title: category.name,
    buttonLabel: "Explore",
    href: `/${category.slug}`,
  }));
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      },
      products: {
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getProductBySlug(
  slug: string,
): Promise<CatalogProduct | null> {
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product || !product.active) return null;

  const parsed = productDefinitionSchema.safeParse(product.definition);
  if (!parsed.success) return null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    hasBackView: product.hasBackView,
    frontImageUrl: product.frontImageUrl,
    backImageUrl: product.backImageUrl,
    definition: parsed.data,
  };
}