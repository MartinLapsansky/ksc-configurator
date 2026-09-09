import { extractAssetUrls } from "@/features/admin/utils/extractAssetUrls";
import type { ProductDefinition } from "@/features/configurator/schemas/productDefinitionSchema";

const blobA = "https://example.blob.vercel-storage.com/logo-a.png";
const blobB = "https://example.blob.vercel-storage.com/layer-b.png";

function makeDefinition(overrides: {
  imageUrl?: string;
  backImageUrl?: string;
  layerUrl?: string;
}): ProductDefinition {
  return {
    version: 1,
    pickers: [
      {
        key: "bgColor",
        type: "color",
        label: "Main Body Colour",
        options: [
          {
            id: "pink",
            name: "Pink",
            hex: "#e4007f",
            imageUrl: overrides.imageUrl,
            backImageUrl: overrides.backImageUrl,
          },
        ],
      },
    ],
    overlays: {
      front: [
        {
          key: "front",
          layerUrl: overrides.layerUrl ?? "",
          source: { type: "upload", pickerKey: "leftChestLogoUrl" },
        },
      ],
    },
  };
}

describe("extractAssetUrls", () => {
  it("collects https URLs from picker options and overlay layers", () => {
    const urls = extractAssetUrls(
      makeDefinition({
        imageUrl: blobA,
        backImageUrl: blobB,
        layerUrl: blobA,
      }),
    );

    expect(urls).toEqual([blobA, blobB]);
  });

  it("ignores static /products/... assets", () => {
    const urls = extractAssetUrls(
      makeDefinition({
        imageUrl: "/products/jerseys/base/jersey-pink.png",
        layerUrl: "/products/jerseys/layers/front-stripes-layer.png",
      }),
    );

    expect(urls).toEqual([]);
  });

  it("de-duplicates URLs that appear multiple times", () => {
    const urls = extractAssetUrls(
      makeDefinition({
        imageUrl: blobA,
        backImageUrl: blobA,
        layerUrl: blobA,
      }),
    );

    expect(urls).toEqual([blobA]);
  });

  it("ignores empty and undefined values", () => {
    const urls = extractAssetUrls(
      makeDefinition({
        imageUrl: "",
        backImageUrl: undefined,
        layerUrl: blobB,
      }),
    );

    expect(urls).toEqual([blobB]);
  });

  it("returns an empty array when there are no assets", () => {
    expect(
      extractAssetUrls({ version: 1, pickers: [], overlays: { front: [] } }),
    ).toEqual([]);
  });
});