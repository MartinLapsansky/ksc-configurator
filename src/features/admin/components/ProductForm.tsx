"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductDefinition } from "@/features/configurator/schemas/productDefinitionSchema";
import type { CatalogProduct } from "@/features/configurator/types";
import ProductConfigurator from "@/features/configurator/components/ProductConfigurator";
import ImageUploadField from "@/features/admin/components/ImageUploadField";
import ImageAssetUploader from "@/features/admin/components/ImageAssetUploader";
import { extractAssetUrls } from "@/features/admin/utils/extractAssetUrls";

type CategoryOption = { id: string; name: string; slug: string };

type ProductFormProps = {
  categories: CategoryOption[];
  initial?: {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    active: boolean;
    sortOrder: number;
    hasBackView: boolean;
    frontImageUrl: string | null;
    backImageUrl: string | null;
    definition: ProductDefinition;
  };
};

export default function ProductForm({ categories, initial }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [hasBackView, setHasBackView] = useState(initial?.hasBackView ?? false);
  const [frontImageUrl, setFrontImageUrl] = useState(initial?.frontImageUrl ?? "");
  const [backImageUrl, setBackImageUrl] = useState(initial?.backImageUrl ?? "");
  const [definitionText, setDefinitionText] = useState(() =>
    JSON.stringify(initial?.definition ?? emptyDefinition(), null, 2),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedDefinition = useMemo<ProductDefinition | null>(() => {
    try {
      return JSON.parse(definitionText) as ProductDefinition;
    } catch {
      return null;
    }
  }, [definitionText]);

  const existingAssetUrls = useMemo<string[]>(
    () => (parsedDefinition ? extractAssetUrls(parsedDefinition) : []),
    [parsedDefinition],
  );

  const handleDeleteUrlFromDefinition = (url: string) => {
    let definition: ProductDefinition;
    try {
      definition = JSON.parse(definitionText) as ProductDefinition;
    } catch {
      return;
    }

    for (const picker of definition.pickers) {
      if (
        picker.type === "color" ||
        picker.type === "doubleColor" ||
        picker.type === "tripleColor"
      ) {
        for (const option of picker.options) {
          if (option.imageUrl === url) option.imageUrl = "";
          if (option.backImageUrl === url) option.backImageUrl = "";
        }
      }
    }

    for (const overlays of [definition.overlays.front, definition.overlays.back]) {
      if (!overlays) continue;
      for (const layer of overlays) {
        if (layer.layerUrl === url) layer.layerUrl = "";
      }
    }

    setDefinitionText(JSON.stringify(definition, null, 2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let definition: ProductDefinition;
    try {
      definition = JSON.parse(definitionText) as ProductDefinition;
    } catch {
      setError("Product definition is not valid JSON");
      setSaving(false);
      return;
    }

    const payload = {
      name,
      slug,
      categoryId,
      active,
      sortOrder: Number(sortOrder) || 0,
      hasBackView,
      frontImageUrl: frontImageUrl || null,
      backImageUrl: backImageUrl || null,
      definition,
    };

    const res = await fetch(
      initial ? `/api/admin/products/${initial.id}` : "/api/admin/products",
      {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Failed to save product");
      setSaving(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const previewProduct: CatalogProduct | null = parsedDefinition
    ? {
        id: initial?.id ?? "preview",
        slug: slug || "preview",
        name: name || "Preview",
        hasBackView,
        frontImageUrl: frontImageUrl || null,
        backImageUrl: backImageUrl || null,
        definition: parsedDefinition,
      }
    : null;

  const inputClass =
    "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-black text-center">
          {initial ? "Edit product" : "New product"}
        </h2>

        <div>
          <label className="block text-sm font-medium text-black">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. jersey-design-146"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
            required
          >
            <option value="" disabled>
              Select category…
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.slug})
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black">Sort order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-sm font-medium text-black">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-black">
              <input
                type="checkbox"
                checked={hasBackView}
                onChange={(e) => setHasBackView(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              Has back view
            </label>
          </div>
        </div>

        {/*<ImageUploadField*/}
        {/*  label="Front image (fallback)"*/}
        {/*  value={frontImageUrl}*/}
        {/*  onChangeAction={setFrontImageUrl}*/}
        {/*/>*/}
        {/*<ImageUploadField*/}
        {/*  label="Back image (fallback)"*/}
        {/*  value={backImageUrl}*/}
        {/*  onChangeAction={setBackImageUrl}*/}
        {/*/>*/}

        <ImageAssetUploader
          label="Upload product images (paste URL into JSON)"
          initialUrls={existingAssetUrls}
          onDeleteUrl={handleDeleteUrlFromDefinition}
        />

        <div>
          <label className="block text-sm font-medium text-black">
            Definition (JSON)
          </label>
          <textarea
            value={definitionText}
            onChange={(e) => setDefinitionText(e.target.value)}
            rows={20}
            spellCheck={false}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {parsedDefinition === null && (
            <p className="mt-1 text-xs text-red-600">Invalid JSON</p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-center">
          <button
              type="submit"
              disabled={saving}
              className="rounded-md cursor-pointer bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save product"}
          </button>
        </div>

      </div>

      <div>
        <div className="mb-3 flex items-center justify-between"></div>
        <h2 className="mb-3 text-lg font-bold text-black">Live preview</h2>
        {previewProduct ? (
          <ProductConfigurator product={previewProduct} />
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
            Enter a valid JSON definition to preview the product.
          </div>
        )}
      </div>
    </form>
  );
}

function emptyDefinition(): ProductDefinition {
  return {
    version: 1,
    pickers: [],
    overlays: { front: [] },
  };
}