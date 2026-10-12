import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminNav from "@/features/admin/components/AdminNav";

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
        <div className="flex w-full justify-center">
          <AdminNav />
        </div>
      </header>
      <main className="w-full p-4 md:p-8">{children}</main>
    </div>
  );
}