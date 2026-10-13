"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  filterCatalog,
  type AdminCategory,
  type AdminProduct,
  type CatalogFilterType,
} from "@/features/admin/utils/filterCatalog";
import {useRouter} from "next/navigation";

const TYPE_OPTIONS: { value: CatalogFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "categories", label: "Categories" },
  { value: "products", label: "Products" },
];

export default function AdminDashboard({
  categories,
  products,
}: {
  categories: AdminCategory[];
  products: AdminProduct[];
}) {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<CatalogFilterType>("all");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const router = useRouter();

  const { categories: visibleCategories, products: visibleProducts } = useMemo(
    () => filterCatalog(query, filterType, categories, products),
    [query, filterType, categories, products],
  );


  const handleActiveStatus = async (kind: "category" | "product", id: string, active: boolean) => {
    setPendingIds((prev) => new Set(prev).add(id));
    try {

      const endpoint = kind === "category"
          ? `/api/admin/categories/${id}/status`
          : `/api/admin/products/${id}/status`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      });

      if(!res.ok){
        console.error("Update failed", await res.json().catch(() => null));
        return;
      }

      router.refresh();

    } catch (error){
      console.error("Error updating active status:", error);
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next;
      });
    }
  };

  const hasResults = visibleCategories.length > 0 || visibleProducts.length > 0;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search categories and products</span>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, slug or category…"
            className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-black"
          />
        </label>

        <div className="flex gap-1 rounded-md bg-gray-100 p-1">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilterType(option.value)}
              className={
                filterType === option.value
                  ? "rounded bg-black px-3 py-1.5 text-sm font-semibold text-white"
                  : "rounded px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black"
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {!hasResults ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No categories or products match your search.
        </div>
      ) : (
        <>
          {(filterType === "all" || filterType === "categories") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Categories</h2>
                <Link
                  href="/admin/categories/new"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                >
                  New category
                </Link>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full min-w-160 text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Name</th>
                      <th className="px-4 py-2 font-medium">Slug</th>
                      <th className="px-4 py-2 font-medium">Parent</th>
                      <th className="px-4 py-2 font-medium">Children</th>
                      <th className="px-4 py-2 font-medium">Products</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visibleCategories.map((category) => (
                      <tr key={category.id} className="text-gray-700">
                        <td className="px-4 py-2">
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="font-medium text-black hover:underline"
                          >
                            {category.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2 font-mono text-xs">
                          {category.slug}
                        </td>
                        <td className="px-4 py-2">
                          {category.parent?.name ?? "—"}
                        </td>
                        <td className="px-4 py-2">
                          {category._count?.children ?? 0}
                        </td>
                        <td className="px-4 py-2">
                          {category._count?.products ?? 0}
                        </td>



                        <td className="px-4 py-2">
                          <select
                            value = {category.active ? "true" : "false"}
                            onChange={(e) => {
                              handleActiveStatus(
                                  "category",
                                  category.id,
                                  e.target.value === "true",
                              )
                          }}
                            disabled={pendingIds.has(category.id)}
                            className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                            >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </td>


                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {(filterType === "all" || filterType === "products") && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Products</h2>
                <Link
                  href="/admin/products/new"
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                >
                  New product
                </Link>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full min-w-160 text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Name</th>
                      <th className="px-4 py-2 font-medium">Slug</th>
                      <th className="px-4 py-2 font-medium">Category</th>
                      <th className="px-4 py-2 font-medium">Back view</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visibleProducts.map((product) => (
                      <tr key={product.id} className="text-gray-700">
                        <td className="px-4 py-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-medium text-black hover:underline"
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2 font-mono text-xs">
                          {product.slug}
                        </td>
                        <td className="px-4 py-2">
                          {product.category?.name ?? "—"}
                        </td>
                        <td className="px-4 py-2">
                          {product.hasBackView ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-2">
                          <select
                              value = {product.active ? "true" : "false"}
                              onChange={(e) => {
                                handleActiveStatus(
                                    "product",
                                    product.id,
                                    e.target.value === "true",
                                )
                              }}
                              disabled={pendingIds.has(product.id)}
                              className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}