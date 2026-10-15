import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OrderCard from "@/features/orders/components/OrderCard";
import OrdersFilters from "@/features/orders/components/OrdersFilters";
import { buildOrdersWhere } from "@/features/orders/utils/buildOrdersWhere";
import type { OrderRole } from "@/features/orders/utils/scopeOrders";
import type { Order, ProductConfig } from "@/types/preview";
import Link from "next/link";

type OrdersPageProps = {
  searchParams: Promise<{ from?: string; status?: string; page?: string }>;
};

const ORDERS_PER_PAGE = 10;

function buildPaginationHref({
    page, from, status
}: {page: number; from?: string; status?: string}) {
  const params = new URLSearchParams();
  params.set("page", page.toString());

  if (from) {
    params.set("from", from);
  }

  if (status) {
    params.set("status", status);
  }

  return `/orders?${params.toString()}`;
}


export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, counties: true },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const { from, status, page } = await searchParams;


  const currentPage = Math.max(Number(page) || 1, 1);
  const skip = (currentPage - 1) * ORDERS_PER_PAGE;

  const where = buildOrdersWhere({
    role: user.role as OrderRole,
    counties: user.counties,
    from,
    status,
  });

  const [orders, totalOrders] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        orderBy: {createdAt: "desc"},
        skip,
        take: ORDERS_PER_PAGE,
        include: {items: true}
      }),
      prisma.order.count({where}),
  ])

  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);

  const orderList: Order[] = orders.map((order) => ({
    id: order.id,
    status: order.status,
    firstName: order.firstName,
    lastName: order.lastName,
    orderNumber: order.orderNumber,
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
      config: item.config as ProductConfig,
    })),
  }));

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-black">Orders</h1>

        <OrdersFilters from={from ?? ""} status={status ?? ""} />

        <div className="mt-6 space-y-4">
          {orderList.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            orderList.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
        {currentPage > 1 && (
            <Link
                href={buildPaginationHref({
                  page: currentPage - 1,
                  from,
                  status,
                })}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Link>
        )
        }
      </div>
    </main>
  );
}