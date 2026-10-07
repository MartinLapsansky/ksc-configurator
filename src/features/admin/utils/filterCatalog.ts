export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  parent?: { id: string; name: string; slug: string } | null;
  _count?: { children: number; products: number };
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  hasBackView: boolean;
  category?: { id: string; name: string; slug: string } | null;
};

export type CatalogFilterType = "all" | "categories" | "products";

export function filterCatalog(
  query: string,
  filterType: CatalogFilterType,
  categories: AdminCategory[],
  products: AdminProduct[],
): { categories: AdminCategory[]; products: AdminProduct[] } {

  const normalizedQuery = query.trim().toLowerCase();

  const matchesQuery = (...values: (string | null | undefined)[]) =>
    !normalizedQuery ||
    values.some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(normalizedQuery),
    );

  const filteredCategories =
    filterType === "products"
      ? []
      : categories.filter((category) =>
          matchesQuery(category.name, category.slug, category.parent?.name),
        );

  const filteredProducts =
    filterType === "categories"
      ? []
      : products.filter((product) =>
          matchesQuery(product.name, product.slug, product.category?.name),
        );

  return { categories: filteredCategories, products: filteredProducts };
}