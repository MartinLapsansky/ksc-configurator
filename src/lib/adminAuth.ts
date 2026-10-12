import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Resolves the authenticated admin user, or `null` when the request is not
 * authenticated/authorized. Called by every admin API route before any data is
 * read or mutated.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "admin") return null;

  return user;
}