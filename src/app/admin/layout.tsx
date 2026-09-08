import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-gray-200 bg-white px-4 py-3 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-black">Admin</h1>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="/admin" className="font-medium text-black hover:underline">
              Dashboard
            </Link>
            <Link
              href="/admin/categories/new"
              className="font-medium text-black hover:underline"
            >
              New category
            </Link>
            <Link
              href="/admin/products/new"
              className="font-medium text-black hover:underline"
            >
              New product
            </Link>
          </nav>
        </div>
      </header>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}