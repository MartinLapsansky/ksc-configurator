import type { Prisma } from "@prisma/client";
import type { OrderRole } from "@/features/orders/utils/scopeOrders";
import { resolveCountyFilter } from "@/features/orders/utils/scopeOrders";
import type { OrderStatus } from "@/features/orders/constants";
import { ORDER_STATUSES } from "@/features/orders/constants";

export type OrdersFilterInput = {
  role: OrderRole;
  counties: string[];
  from?: string;
  status?: string;
};

/**
 * Builds the Prisma `where` clause for the orders list by combining the
 * county scoping with an optional "from" date (inclusive lower bound) and an
 * optional status filter.
 */
export function buildOrdersWhere({
  role,
  counties,
  from,
  status,
}: OrdersFilterInput): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};

  const countyFilter = resolveCountyFilter(role, counties);

  if (countyFilter) {
    Object.assign(where, countyFilter);
  }

  if (from) {
    const date = new Date(from);
    if (!Number.isNaN(date.getTime())) {
      where.createdAt = { gte: date };
    }
  }

  if (status && (ORDER_STATUSES as readonly string[]).includes(status)) {
    where.status = status as OrderStatus;
  }

  return where;
}