import type { Prisma } from "@prisma/client";

/**
 * Builds Prisma `where` clauses for the admin catalog dashboard by translating
 * the URL search-param filters (search text and optional product category)
 * into server-side filters, mirroring `buildOrdersWhere` for the orders page.
 */

function containsQuery(query: string): { contains: string; mode: "insensitive" } {
  return { contains: query, mode: "insensitive" };
}

export function buildCategoryWhere(query?: string): Prisma.CategoryWhereInput {
  const where: Prisma.CategoryWhereInput = {};

  if (query) {
    const match = containsQuery(query);
    where.OR = [
      { name: match },
      { slug: match },
      { parent: { is: { name: match } } },
    ];
  }

  return where;
}

export function buildProductWhere(
  query?: string,
  categoryId?: string,
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (query) {
    const match = containsQuery(query);
    where.OR = [
      { name: match },
      { slug: match },
      { category: { is: { name: match } } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  return where;
}