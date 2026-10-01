"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  filterCatalog,
  type AdminCategory,
  type AdminProduct,
  type CatalogFilterType,
} from "@/features/admin/utils/filterCatalog";

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

  const { categories: visibleCategories, products: visibleProducts } = useMemo(
    () => filterCatalog(query, filterType, categories, products),
    [query, filterType, categories, products],
  );

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
            onChange={(event) => setQuery(event.target.value)}
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
                          {category.active ? (
                            <span className="text-green-600">Active</span>
                          ) : (
                            <span className="text-gray-400">Inactive</span>
                          )}
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
                          {product.active ? (
                            <span className="text-green-600">Active</span>
                          ) : (
                            <span className="text-gray-400">Inactive</span>
                          )}
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