"use client";

import React, { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  organisation: string;
  quantity: number;
  leadTime: string;
  message: string;
  jerseyConfig: {
    bgColor?: { name: string; hex: string };
    stripeColor?: { name: string; hex: string };
    brandingColor?: { name: string; hex: string };
    rightLogo?: { name: string; src: string };
    leftChestLogoUrl?: string;
    sponsorLogoUrl?: string;
    backLogoUrl?: string;
    backTextConfig?: {
      enabled: boolean;
      text: string;
      color: { name: string; hex: string };
    };
    frontTextConfig?: {
      enabled: boolean;
      text: string;
      color: { name: string; hex: string };
    };
  };
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function OrdersPage() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order");
        if (!res.ok) {
          throw new Error("Failed to load orders");
        }

        const data = await res.json();
        setOrders(data.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Nepodarilo sa načítať objednávky.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders()
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-6">
        <p className="text-black">Načítavam objednávky...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-black">Orders</h1>

        <div className="mt-6 space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-600">Žiadne objednávky neboli nájdené.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-md border border-gray-200 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-black">
                      {order.firstName} {order.lastName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {order.email} · {order.phoneCountryCode} {order.phoneNumber}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    Status: <span className="font-medium text-black">{order.status}</span>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
                  <p><span className="font-medium">Organisation:</span> {order.organisation}</p>
                  <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
                  <p><span className="font-medium">Lead time:</span> {order.leadTime}</p>
                  <p><span className="font-medium">User ID:</span> {order.userId ?? "Guest"}</p>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-black">Message</p>
                  <p className="text-sm text-gray-700">{order.message}</p>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-black">Jersey config</p>
                  <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs text-gray-800">
                    {JSON.stringify(order.jerseyConfig, null, 2)}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}