import { getBreadcrumbItems } from "@/lib/breadcrumbs";

describe("getBreadcrumbItems", () => {
  it("returns only Home for the root path", () => {
    expect(getBreadcrumbItems("/")).toEqual([{ label: "Home", href: "/" }]);
  });

  it("returns only Home for an empty path", () => {
    expect(getBreadcrumbItems("")).toEqual([{ label: "Home", href: "/" }]);
  });

  it("builds a trail for a nested product path", () => {
    const items = getBreadcrumbItems("/sportswear/jerseys/jersey-design-146");

    expect(items).toEqual([
      { label: "Home", href: "/" },
      { label: "Sportswear", href: "/sportswear" },
      { label: "Jerseys", href: "/sportswear/jerseys" },
      {
        label: "Jersey Design 146",
        href: "/sportswear/jerseys/jersey-design-146",
      },
    ]);
  });

  it("applies the acronym override for GAA", () => {
    const items = getBreadcrumbItems("/gaa");
    expect(items[1].label).toBe("GAA");
  });

  it("applies the acronym override for KCS", () => {
    const items = getBreadcrumbItems("/kcs");
    expect(items[1].label).toBe("KCS");
  });
});