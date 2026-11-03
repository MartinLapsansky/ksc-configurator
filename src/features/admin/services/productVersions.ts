import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * A database client that exposes `productVersion` access. Both the main client
 * and a transaction client satisfy this shape, so the same helper can be used
 * inside or outside of an interactive `$transaction`.
 */
type ProductVersionDb = Pick<PrismaClient, "productVersion">;

export type ProductVersionSnapshot = {
  productId: string;
  slug: string;
  name: string;
  categoryId: string;
  active: boolean;
  sortOrder: number;
  hasBackView: boolean;
  frontImageUrl: string | null;
  backImageUrl: string | null;
  coverImageUrl: string | null;
  definition: Prisma.InputJsonValue;
  createdBy?: string | null;
};

/**
 * Serializes a value into a canonical form so two structurally-equal JSON
 * documents produce the same string regardless of key order. Used to detect a
 * *real* change in a product's `definition` before recording a new version.
 */
function canonicalize(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  const object = value as Record<string, unknown>;
  const keys = Object.keys(object).sort();

  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`)
    .join(",")}}`;
}

export function hasDefinitionChanged(a: unknown, b: unknown): boolean {
  return canonicalize(a) !== canonicalize(b);
}

/**
 * Records a new snapshot of a product. The `version` number is computed as the
 * current maximum version for the product plus one, so versions are sequential
 * per product starting from 1.
 */
export async function createProductVersion(
  snapshot: ProductVersionSnapshot,
  db: ProductVersionDb = prisma,
) {
  const latest = await db.productVersion.findFirst({
    where: { productId: snapshot.productId },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const version = (latest?.version ?? 0) + 1;

  return db.productVersion.create({
    data: {
      productId: snapshot.productId,
      version,
      definition: snapshot.definition,
      createdBy: snapshot.createdBy,
      slug: snapshot.slug,
      name: snapshot.name,
      categoryId: snapshot.categoryId,
      active: snapshot.active,
      sortOrder: snapshot.sortOrder,
      hasBackView: snapshot.hasBackView,
      frontImageUrl: snapshot.frontImageUrl,
      backImageUrl: snapshot.backImageUrl,
      coverImageUrl: snapshot.coverImageUrl,
    },
  });
}
