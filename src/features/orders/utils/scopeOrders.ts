import type { Prisma } from "@prisma/client";

export type OrderRole = "user" | "admin";

/**
 * Builds the county portion of an orders query based on the current user's
 * role and assigned counties.
 *
 * - `admin` sees every order (no county filter).
 * - `user` (manager) sees only orders whose `county` is in their assignment.
 * - A manager with no assignments sees no orders.
 */
export function resolveCountyFilter(
  role: OrderRole,
  counties: string[],
): Pick<Prisma.OrderWhereInput, "county"> | undefined {
  if (role === "admin") {
    return undefined;
  }

  if (counties.length === 0) {
    return { county: { in: [] } };
  }

  return { county: { in: counties } };
}