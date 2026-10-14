import React from "react";
import { prisma } from "@/lib/prisma";
import ManagerCountyManager from "@/features/admin/components/ManagerCountyManager";

export default async function ManagersPage() {
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      counties: true,
    },
  });

  return <ManagerCountyManager users={users} />;
}