import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderCard from "@/features/orders/components/OrderCard";
import type { Order, ProductConfig } from "@/types/preview";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const orderList: Order[] = orders.map((order) => ({
    id: order.id,
    status: order.status,
    firstName: order.firstName,
    lastName: order.lastName,
    county: order.county,
    country: order.country,
    email: order.email,
    phoneCountryCode: order.phoneCountryCode,
    phoneNumber: order.phoneNumber,
    organisation: order.organisation,
    quantity: order.quantity,
    message: order.message,
    userId: order.userId,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      // The config JSON originates from a validated ProductConfig written via
      // the order route, so this boundary is safe.
      config: item.config as ProductConfig,
    })),
  }));

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-black">Orders</h1>

        <div className="mt-6 space-y-4">
          {orderList.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            orderList.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </div>
    </main>
  );
}