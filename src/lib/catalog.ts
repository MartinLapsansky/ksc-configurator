import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productDefinitionSchema } from "@/features/configurator/schemas/productDefinitionSchema";
import type { CatalogProduct } from "@/features/configurator/types";

/**
 * Server-side catalogue access layer. Categories and products are stored in
 * PostgreSQL and consumed by the dynamic `[...slug]` route and listing pages.
 *
 * Catalogue data changes rarely, so every lookup is cached in Next's data
 * cache. This removes the database round-trip (and Neon pooler latency) that
 * previously ran on every category/product click. Admin mutations invalidate
 * the cache through the shared `CATALOG_CACHE_TAG`.
 */

export const CATALOG_CACHE_TAG = "catalog";

export const CATALOG_REVALIDATE_SECONDS = 60;

export type CatalogCardItem = {
  id: string;
  title: string;
  buttonLabel: string;
  href: string;
  coverImageUrl: string | null;
  kind: "category" | "product";
  isTopLevel?: boolean;
};

async function _getTopLevelCategories(): Promise<CatalogCardItem[]> {
  const categories = await prisma.category.findMany({
    where: { parentId: null, active: true },
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((category) => ({
    id: category.id,
    title: category.name,
    buttonLabel: "Explore",
    href: `/${category.slug}`,
    coverImageUrl: category.coverImageUrl,
    kind: "category",
    isTopLevel: true,
  }));
}

export const getTopLevelCategories = unstable_cache(
  _getTopLevelCategories,
  ["catalog", "top-level-categories"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [CATALOG_CACHE_TAG] },
);

async function _getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      coverImageUrl: true,
      children: {
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true, coverImageUrl: true },
      },
      products: {
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true, coverImageUrl: true },
      },
    },
  });
}

export const getCategoryBySlug = unstable_cache(
  _getCategoryBySlug,
  ["catalog", "category-by-slug"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [CATALOG_CACHE_TAG] },
);

async function _getProductBySlug(
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

export const getProductBySlug = unstable_cache(
  _getProductBySlug,
  ["catalog", "product-by-slug"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [CATALOG_CACHE_TAG] },
);

/**
 * Resolves the full path segments for every active category and product,
 * e.g. `["sportskit"]`, `["sportskit", "jerseys"]` or
 * `["sportskit", "jerseys", "product-slug"]`. Used by `generateStaticParams`
 * so the shop routes can be prerendered/ISR instead of rendered on demand.
 */
export async function getAllCatalogPaths(): Promise<{ slug: string[] }[]> {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      select: { id: true, slug: true, parentId: true },
    }),
    prisma.product.findMany({
      where: { active: true },
      select: { slug: true, categoryId: true },
    }),
  ]);

  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );

  const pathByCategoryId = new Map<string, string[]>();

  const resolveCategoryPath = (categoryId: string): string[] => {
    const cached = pathByCategoryId.get(categoryId);
    if (cached) return cached;

    const category = categoryById.get(categoryId);
    if (!category) return [];

    const parentPath = category.parentId
      ? resolveCategoryPath(category.parentId)
      : [];

    const path = [...parentPath, category.slug];
    pathByCategoryId.set(categoryId, path);
    return path;
  };

  const paths = new Map<string, { slug: string[] }>();

  for (const category of categories) {
    const path = resolveCategoryPath(category.id);
    if (path.length === 0) continue;
    paths.set(path.join("/"), { slug: path });
  }

  for (const product of products) {
    const categoryPath = resolveCategoryPath(product.categoryId);
    if (categoryPath.length === 0) continue;

    const path = [...categoryPath, product.slug];
    paths.set(path.join("/"), { slug: path });
  }

  return Array.from(paths.values());
}