import { buildAdminHref } from "@/features/admin/utils/buildAdminHref";

describe("buildAdminHref", () => {
  it("returns the base path when there are no params", () => {
    expect(buildAdminHref({})).toBe("/admin");
  });

  it("omits default type and page 1", () => {
    expect(buildAdminHref({ type: "all", page: 1 })).toBe("/admin");
  });

  it("includes a non-default type", () => {
    expect(buildAdminHref({ type: "products" })).toBe("/admin?type=products");
  });

  it("includes query, category, and page", () => {
    expect(
      buildAdminHref({ type: "products", q: "jersey", category: "cat-1", page: 3 }),
    ).toBe("/admin?type=products&q=jersey&category=cat-1&page=3");
  });
});