"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { buildAdminHref } from "@/features/admin/utils/buildAdminHref";
import Button from "@/components/shared/Button";
import type {
  AdminCategory,
  AdminProduct,
  CatalogFilterType,
  CategoryOption,
} from "@/features/admin/types";

const TYPE_OPTIONS: { value: CatalogFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "categories", label: "Categories" },
  { value: "products", label: "Products" },
];

type AdminDashboardProps = {
  categories: AdminCategory[];
  products: AdminProduct[];
  categoryOptions: CategoryOption[];
  filterType: CatalogFilterType;
  query: string;
  categoryId: string;
  currentPage: number;
  categoryTotalPages: number;
  productTotalPages: number;
  showCategories: boolean;
  showProducts: boolean;
};

export default function AdminDashboard({
  categories,
  products,
  categoryOptions,
  filterType,
  query,
  categoryId,
  currentPage,
  categoryTotalPages,
  productTotalPages,
  showCategories,
  showProducts,
}: AdminDashboardProps) {
  const router = useRouter();
  const [queryInput, setQueryInput] = useState(query);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);

  const debouncedQuery = useDebounce(queryInput, 300);
  const latestParams = useRef({ filterType, categoryId, query });
  latestParams.current = { filterType, categoryId, query };

  useEffect(() => {
    const normalized = debouncedQuery.trim();
    const current = latestParams.current.query.trim();

    if (normalized === current) return;

    router.replace(
      buildAdminHref({
        type: latestParams.current.filterType,
        q: normalized,
        category: latestParams.current.categoryId,
      }),
    );
  }, [debouncedQuery, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActiveStatus = async (
    kind: "category" | "product",
    id: string,
    active: boolean,
  ) => {
    setPendingIds((prev) => new Set(prev).add(id));
    try {
      const endpoint =
        kind === "category"
          ? `/api/admin/categories/${id}/status`
          : `/api/admin/products/${id}/status`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      });

      if (!res.ok) {
        console.error("Update failed", await res.json().catch(() => null));
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating active status:", error);
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const hasResults = categories.length > 0 || products.length > 0;

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
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search by name, slug or category…"
            className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-black"
          />
        </label>

        <div className="flex gap-1 rounded-md bg-gray-100 p-1">
          {TYPE_OPTIONS.map((option) => {
            const isActive = filterType === option.value;

            return (
              <Link
                key={option.value}
                href={buildAdminHref({
                  type: option.value,
                  q: query,
                  category: categoryId,
                })}
                className={
                  isActive
                    ? "rounded bg-black px-3 py-1.5 text-sm font-semibold text-white"
                    : "rounded px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black"
                }
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </section>

      {!hasResults ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No categories or products match your search.
        </div>
      ) : ( //ELSE IF THERE IS SOME CATEGORIES OR PRODUCTS
        <>
          {showCategories && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Categories</h2>
                <Button href="/admin/categories/new" size="sm">
                  New category
                </Button>
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
                    {categories.map((category) => (
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
                            value={category.active ? "true" : "false"}
                            onChange={(e) => {
                              handleActiveStatus(
                                "category",
                                category.id,
                                e.target.value === "true",
                              );
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

              <div className="mt-3 flex items-center justify-end gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={buildAdminHref({
                      type: filterType,
                      q: query,
                      category: categoryId,
                      page: currentPage - 1,
                    })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-400">
                    Previous
                  </span>
                )}

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {categoryTotalPages || 1}
                </span>

                {currentPage < categoryTotalPages ? (
                  <Link
                    href={buildAdminHref({
                      type: filterType,
                      q: query,
                      category: categoryId,
                      page: currentPage + 1,
                    })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-400">
                    Next
                  </span>
                )}
              </div>
            </section>
          )}

          {showProducts && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Products</h2>
                <Button href="/admin/products/new" size="sm">
                  New product
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full min-w-160 text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Preview</th>
                      <th className="px-4 py-2 font-medium">Name</th>
                      <th className="px-4 py-2 font-medium">Slug</th>
                      <th className="px-4 py-2 font-medium">
                        <div ref={categoryDropdownRef} className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setCategoryDropdownOpen((open) => !open)
                            }
                            className="inline-flex items-center gap-1 rounded hover:text-black focus:outline-none"
                          >
                            Category
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m19 9-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {categoryDropdownOpen && (
                            <div className="absolute left-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  router.replace(
                                    buildAdminHref({
                                      type: filterType,
                                      q: query,
                                    }),
                                  );
                                  setCategoryDropdownOpen(false);
                                }}
                                className={
                                  "block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 " +
                                  (categoryId === ""
                                    ? "bg-gray-50 font-semibold text-black"
                                    : "text-gray-700")
                                }
                              >
                                All categories
                              </button>

                              {categoryOptions.map((option) => {
                                const label = option.parentName
                                  ? `${option.parentName} / ${option.name}`
                                  : option.name;
                                const isSelected = option.id === categoryId;

                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                      router.replace(
                                        buildAdminHref({
                                          type: filterType,
                                          q: query,
                                          category: option.id,
                                        }),
                                      );
                                      setCategoryDropdownOpen(false);
                                    }}
                                    className={
                                      "block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 " +
                                      (isSelected
                                        ? "bg-gray-50 font-semibold text-black"
                                        : "text-gray-700")
                                    }
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-2 font-medium">Back view</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product.id} className="text-gray-700">
                        <td className="px-4 py-2">
                          {product.coverImageUrl || product.frontImageUrl ? (
                            <Image
                              src={
                                product.coverImageUrl ??
                                product.frontImageUrl ??
                                ""
                              }
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-md border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-xs text-gray-400">
                              —
                            </div>
                          )}
                        </td>
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
                            value={product.active ? "true" : "false"}
                            onChange={(e) => {
                              handleActiveStatus(
                                "product",
                                product.id,
                                e.target.value === "true",
                              );
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

              <div className="mt-3 flex items-center justify-end gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={buildAdminHref({
                      type: filterType,
                      q: query,
                      category: categoryId,
                      page: currentPage - 1,
                    })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-400">
                    Previous
                  </span>
                )}

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {productTotalPages || 1}
                </span>

                {currentPage < productTotalPages ? (
                  <Link
                    href={buildAdminHref({
                      type: filterType,
                      q: query,
                      category: categoryId,
                      page: currentPage + 1,
                    })}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-400">
                    Next
                  </span>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}