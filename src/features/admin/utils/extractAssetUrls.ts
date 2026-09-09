import type { ProductDefinition } from "@/features/configurator/schemas/productDefinitionSchema";

/**
 * Collects all public Vercel Blob image URLs referenced by a product definition.
 *
 * These are the `https://` URLs an admin uploaded via the image asset uploader
 * and then pasted into the definition. Static `/products/...` assets are
 * intentionally ignored because they cannot be deleted from Vercel Blob.
 *
 * Sources covered:
 * - color / doubleColor / tripleColor picker options → `imageUrl`, `backImageUrl`
 * - overlay layers (front + back) → `layerUrl`
 */
export function extractAssetUrls(definition: ProductDefinition): string[] {
  const urls = new Set<string>();

  for (const picker of definition.pickers) {
    if (
      picker.type === "color" ||
      picker.type === "doubleColor" ||
      picker.type === "tripleColor"
    ) {
      for (const option of picker.options) {
        collectUrl(urls, option.imageUrl);
        collectUrl(urls, option.backImageUrl);
      }
    }
  }

  const overlayLists = [definition.overlays.front, definition.overlays.back]
    .filter((list): list is NonNullable<typeof list> => Boolean(list));

  for (const overlays of overlayLists) {
    for (const layer of overlays) {
      collectUrl(urls, layer.layerUrl);
    }
  }

  return Array.from(urls);
}

function collectUrl(urls: Set<string>, url: string | undefined): void {
  if (!url || !url.startsWith("https://")) return;
  urls.add(url);
}