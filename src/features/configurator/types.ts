import type { ProductDefinition } from "@/features/configurator/schemas/productDefinitionSchema";

/**
 * Serialisable product shape consumed by the client-side configurator. Produced
 * by the server-side catalogue layer from the Prisma `Product` model with its
 * `definition` Json parsed/validated into a `ProductDefinition`.
 */
export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  hasBackView: boolean;
  frontImageUrl: string | null;
  backImageUrl: string | null;
  definition: ProductDefinition;
};