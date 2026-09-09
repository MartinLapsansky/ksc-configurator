import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        _count: { select: { children: true, products: true } },
      },
    }),
    prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
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
                  <td className="px-4 py-2 font-mono text-xs">{category.slug}</td>
                  <td className="px-4 py-2">{category.parent?.name ?? "—"}</td>
                  <td className="px-4 py-2">{category._count.children}</td>
                  <td className="px-4 py-2">{category._count.products}</td>
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
              {products.map((product) => (
                <tr key={product.id} className="text-gray-700">
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-black hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{product.slug}</td>
                  <td className="px-4 py-2">{product.category?.name ?? "—"}</td>
                  <td className="px-4 py-2">{product.hasBackView ? "Yes" : "No"}</td>
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
    </div>
  );
}