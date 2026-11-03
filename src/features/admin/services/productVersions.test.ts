import {
  createProductVersion,
  hasDefinitionChanged,
  type ProductVersionSnapshot,
} from "@/features/admin/services/productVersions";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    productVersion: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const findFirst = prisma.productVersion.findFirst as unknown as jest.Mock;
const create = prisma.productVersion.create as unknown as jest.Mock;

function makeSnapshot(
  overrides: Partial<ProductVersionSnapshot> = {},
): ProductVersionSnapshot {
  return {
    productId: "product-1",
    slug: "jersey-design-146",
    name: "Jersey Design 146",
    categoryId: "category-1",
    active: true,
    sortOrder: 0,
    hasBackView: true,
    frontImageUrl: "/products/jerseys/base/jersey-pink.png",
    backImageUrl: null,
    coverImageUrl: null,
    definition: { version: 1, pickers: [], overlays: { front: [] } },
    createdBy: "user-1",
    ...overrides,
  };
}

describe("hasDefinitionChanged", () => {
  it("returns false for identical objects", () => {
    const a = { version: 1, pickers: [{ key: "bg", type: "color" }] };
    expect(hasDefinitionChanged(a, JSON.parse(JSON.stringify(a)))).toBe(false);
  });

  it("returns false when only the key order differs", () => {
    expect(
      hasDefinitionChanged(
        { a: 1, b: { c: 2, d: 3 } },
        { b: { d: 3, c: 2 }, a: 1 },
      ),
    ).toBe(false);
  });

  it("returns true when a nested value changes", () => {
    expect(hasDefinitionChanged({ a: { b: 1 } }, { a: { b: 2 } })).toBe(true);
  });

  it("returns true when a key is added", () => {
    expect(hasDefinitionChanged({ a: 1 }, { a: 1, b: 2 })).toBe(true);
  });

  it("handles arrays", () => {
    expect(hasDefinitionChanged([1, 2, 3], [1, 2, 3])).toBe(false);
    expect(hasDefinitionChanged([1, 2, 3], [1, 2, 4])).toBe(true);
    expect(hasDefinitionChanged([1, 2, 3], [1, 2])).toBe(true);
  });

  it("distinguishes null from undefined", () => {
    expect(hasDefinitionChanged(null, undefined)).toBe(true);
    expect(hasDefinitionChanged(null, null)).toBe(false);
  });

  it("compares primitives", () => {
    expect(hasDefinitionChanged("a", "a")).toBe(false);
    expect(hasDefinitionChanged(1, 1)).toBe(false);
    expect(hasDefinitionChanged(1, 2)).toBe(true);
    expect(hasDefinitionChanged("a", "b")).toBe(true);
  });
});

describe("createProductVersion", () => {
  beforeEach(() => {
    findFirst.mockReset();
    create.mockReset();
  });

  it("creates version 1 when the product has no versions yet", async () => {
    findFirst.mockResolvedValue(null);
    create.mockResolvedValue({ id: "v1", version: 1 });

    const snapshot = makeSnapshot();
    await createProductVersion(snapshot);

    expect(findFirst).toHaveBeenCalledWith({
      where: { productId: "product-1" },
      orderBy: { version: "desc" },
      select: { version: true },
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        productId: "product-1",
        version: 1,
        definition: snapshot.definition,
        createdBy: "user-1",
        slug: "jersey-design-146",
        name: "Jersey Design 146",
        categoryId: "category-1",
        active: true,
        sortOrder: 0,
        hasBackView: true,
        frontImageUrl: "/products/jerseys/base/jersey-pink.png",
        backImageUrl: null,
        coverImageUrl: null,
      },
    });
  });

  it("increments the version from the latest existing version", async () => {
    findFirst.mockResolvedValue({ version: 4 });
    create.mockResolvedValue({ id: "v5", version: 5 });

    await createProductVersion(makeSnapshot());

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ version: 5 }),
      }),
    );
  });

  it("passes through null image URLs and createdBy", async () => {
    findFirst.mockResolvedValue(null);
    create.mockResolvedValue({});

    await createProductVersion(
      makeSnapshot({
        frontImageUrl: null,
        backImageUrl: null,
        coverImageUrl: null,
        createdBy: null,
      }),
    );

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          createdBy: null,
          frontImageUrl: null,
          backImageUrl: null,
          coverImageUrl: null,
        }),
      }),
    );
  });
});
