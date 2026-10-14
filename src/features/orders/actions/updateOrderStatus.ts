"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveCountyFilter } from "@/features/orders/utils/scopeOrders";
import type { OrderRole } from "@/features/orders/utils/scopeOrders";
import { ORDER_STATUSES } from "@/features/orders/constants";

const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(ORDER_STATUSES),
});

export type UpdateOrderStatusResult = {
  ok: boolean;
  error?: string;
};

/**
 * Updates an order's status, enforcing the same county scoping used by the
 * orders list: admins can update any order, managers only their own counties.
 */
export async function updateOrderStatus(
  input: unknown,
): Promise<UpdateOrderStatusResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = updateOrderStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Invalid status" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, counties: true },
  });

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { orderId, status } = parsed.data;

  const scope = resolveCountyFilter(user.role as OrderRole, user.counties);

  try {
    const updated = await prisma.order.updateMany({
      where: {
        id: orderId,
        ...scope,
      },
      data: { status: status as OrderStatus },
    });

    if (updated.count === 0) {
      return { ok: false, error: "Order not found or not allowed" };
    }

    revalidatePath("/orders");

    return { ok: true };
  } catch (error) {
    console.error("Order status update failed:", error);
    return { ok: false, error: "Update failed" };
  }
}