import {
  buildCategoryWhere,
  buildProductWhere,
} from "@/features/admin/utils/buildCatalogWhere";

describe("buildCategoryWhere", () => {
  it("returns an empty where clause when there is no query", () => {
    expect(buildCategoryWhere()).toEqual({});
    expect(buildCategoryWhere("")).toEqual({});
  });

  it("matches name, slug, and parent name case-insensitively", () => {
    const where = buildCategoryWhere("jersey");

    expect(where.OR).toEqual([
      { name: { contains: "jersey", mode: "insensitive" } },
      { slug: { contains: "jersey", mode: "insensitive" } },
      { parent: { is: { name: { contains: "jersey", mode: "insensitive" } } } },
    ]);
  });
});

describe("buildProductWhere", () => {
  it("returns an empty where clause without query or category", () => {
    expect(buildProductWhere()).toEqual({});
    expect(buildProductWhere("")).toEqual({});
  });

  it("matches name, slug, and category name case-insensitively", () => {
    const where = buildProductWhere("zip");

    expect(where.OR).toEqual([
      { name: { contains: "zip", mode: "insensitive" } },
      { slug: { contains: "zip", mode: "insensitive" } },
      { category: { is: { name: { contains: "zip", mode: "insensitive" } } } },
    ]);
  });

  it("filters by category id", () => {
    const where = buildProductWhere(undefined, "cat-1");

    expect(where).toEqual({ categoryId: "cat-1" });
  });

  it("combines query and category filters", () => {
    const where = buildProductWhere("jersey", "cat-1");

    expect(where.categoryId).toBe("cat-1");
    expect(where.OR).toHaveLength(3);
  });
});