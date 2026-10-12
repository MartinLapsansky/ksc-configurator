"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/features/admin/components/ImageUploadField";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type CategoryFormProps = {
  categories: CategoryOption[];
  initial?: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    sortOrder: number;
    active: boolean;
    coverImageUrl: string | null;
  };
};

export default function CategoryForm({ categories, initial }: CategoryFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [parentId, setParentId] = useState<string>(initial?.parentId ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [active, setActive] = useState(initial?.active ?? true);
  const [coverImageUrl, setCoverImageUrl] = useState(
    initial?.coverImageUrl ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!initial) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    const res = await fetch(`/api/admin/categories/${initial.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Failed to delete category");
      setDeleting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug,
      parentId: parentId || null,
      sortOrder: Number(sortOrder) || 0,
      active,
      coverImageUrl: coverImageUrl || null,
    };

    const res = await fetch(
      initial ? `/api/admin/categories/${initial.id}` : "/api/admin/categories",
      {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Failed to save category");
      setSaving(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const inputClass =
    "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-black text-center">
        {initial ? "Edit category" : "New category"}
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
          placeholder="e.g. jerseys"
          className={inputClass}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Lowercase kebab-case, for example zip-tops.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Parent category</label>
        <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={inputClass}>
          <option value="">None (top level)</option>
          {categories
            .filter((c) => c.id !== initial?.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.slug})
              </option>
            ))}
        </select>
      </div>

      <ImageUploadField
        label="Cover image"
        value={coverImageUrl}
        onChangeAction={setCoverImageUrl}
      />

      <div className="grid pb-3 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-black">Sort order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm font-medium text-black">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            Active
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-center gap-3">
        <button
          type="submit"
          disabled={saving || deleting}
          className="rounded-md cursor-pointer bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-600 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save category"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="rounded-md cursor-pointer bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete category"}
          </button>
        )}
      </div>
    </form>
  );
}