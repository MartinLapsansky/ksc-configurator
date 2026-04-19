"use client";

import React, { useEffect, useState } from "react";
import OrderCard from "../../components/orderComponents/OrderCard";
import type { Order } from "@/types/preview";

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

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen p-6">
                <p className="text-black">Loading orders...</p>
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
                        <p className="text-gray-600">No orders found.</p>
                    ) : (
                        orders.map((order) => <OrderCard key={order.id} order={order} />)
                    )}
                </div>
            </div>
        </main>
    );
}