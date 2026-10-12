import {
  filterCatalog,
  type AdminCategory,
  type AdminProduct,
} from "@/features/admin/utils/filterCatalog";

const categories: AdminCategory[] = [
  {
    id: "cat-jerseys",
    name: "Jerseys",
    slug: "jerseys",
    active: true,
    parent: null,
    _count: { children: 2, products: 3 },
  },
  {
    id: "cat-shorts",
    name: "Shorts",
    slug: "shorts",
    active: true,
    parent: { id: "cat-kit", name: "Sports Kit", slug: "sports-kit" },
    _count: { children: 0, products: 1 },
  },
  {
    id: "cat-vests",
    name: "Vests",
    slug: "vests",
    active: false,
    parent: null,
    _count: { children: 0, products: 0 },
  },
];

const products: AdminProduct[] = [
  {
    id: "prod-home-jersey",
    name: "Home Jersey",
    slug: "home-jersey",
    active: true,
    hasBackView: true,
    category: { id: "cat-jerseys", name: "Jerseys", slug: "jerseys" },
  },
  {
    id: "prod-zip-top",
    name: "Zip Top",
    slug: "zip-top",
    active: true,
    hasBackView: false,
    category: { id: "cat-kit", name: "Sports Kit", slug: "sports-kit" },
  },
];

describe("filterCatalog", () => {
  it("returns everything when the query is empty and type is all", () => {
    const result = filterCatalog("", "all", categories, products);

    expect(result.categories).toHaveLength(3);
    expect(result.products).toHaveLength(2);
  });

  it("is case-insensitive and matches by name", () => {
    const result = filterCatalog("JERSEY", "all", categories, products);

    expect(result.categories.map((c) => c.slug)).toEqual([
      "jerseys",
    ]);
    expect(result.products.map((p) => p.slug)).toEqual(["home-jersey"]);
  });

  it("matches categories by slug", () => {
    const result = filterCatalog("short", "categories", categories, products);

    expect(result.categories.map((c) => c.slug)).toEqual(["shorts"]);
  });

  it("matches categories by parent name", () => {
    const result = filterCatalog("sports kit", "categories", categories, products);

    expect(result.categories.map((c) => c.slug)).toEqual(["shorts"]);
  });

  it("matches products by category name", () => {
    const result = filterCatalog("sports kit", "products", categories, products);

    expect(result.products.map((p) => p.slug)).toEqual(["zip-top"]);
  });

  it("ignores leading/trailing whitespace in the query", () => {
    const result = filterCatalog("  vests  ", "all", categories, products);

    expect(result.categories.map((c) => c.slug)).toEqual(["vests"]);
    expect(result.products).toHaveLength(0);
  });

  it("returns no categories when the type is products", () => {
    const result = filterCatalog("", "products", categories, products);

    expect(result.categories).toHaveLength(0);
    expect(result.products).toHaveLength(2);
  });

  it("returns no products when the type is categories", () => {
    const result = filterCatalog("", "categories", categories, products);

    expect(result.categories).toHaveLength(3);
    expect(result.products).toHaveLength(0);
  });

  it("returns empty lists when nothing matches", () => {
    const result = filterCatalog("does-not-exist", "all", categories, products);

    expect(result.categories).toHaveLength(0);
    expect(result.products).toHaveLength(0);
  });
});