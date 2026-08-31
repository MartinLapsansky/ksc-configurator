"use client";

import React, { useState } from "react";
import type { Order, ProductConfig } from "@/types/preview";
import ProductConfigSummary from "./ProductConfigSummary";

import JerseyPreviewOrder from "./productViews/jerseyPreviewOrder";
import HalfZipPreviewOrder from "./productViews/halfZipPreviewOrder";
import CrewNeckPreviewOrder from "./productViews/crewNeckPreviewOrder";

type OrderCardProps = {
    order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
    const [open, setOpen] = useState(false);

    const renderProductPreview = (productConfig: ProductConfig) => {
        switch (productConfig.productType) {
            case "jersey":
                return <JerseyPreviewOrder productConfig={productConfig} />;
            case "halfZip":
                return <HalfZipPreviewOrder productConfig={productConfig} />;
            case "crewNeck":
                return <CrewNeckPreviewOrder productConfig={productConfig} />;
            default:
                return null;
        }
    };

    const configs = order.items?.length
        ? order.items
        : order.productConfig
          ? [{ id: order.id, quantity: order.quantity, config: order.productConfig }]
          : [];


    return (
        <div className="rounded-xl border cursor-pointer border-gray-200 bg-white p-4 shadow-sm">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full flex-col gap-3 text-left md:flex-row md:items-center md:justify-between"
            >
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
            </button>

            <div className="mt-3 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
                <p>
                    <span className="font-medium">Organisation:</span> {order.organisation}
                </p>
                <p>
                    <span className="font-medium">Quantity:</span> {order.quantity}
                </p>
                <p>
                    <span className="font-medium">County:</span> {order.county}
                </p>
                <p>
                    <span className="font-medium">Country:</span> {order.country || "—"}
                </p>
                <p>
                    <span className="font-medium">User ID:</span> {order.userId ?? "Guest"}
                </p>
            </div>

            <div className="mt-3">
                <p className="text-sm font-medium text-black">Message</p>
                <p className="text-sm text-gray-700">{order.message}</p>
            </div>

            {open && (
                <div className="mt-4 space-y-6 border-t border-gray-200 pt-4">
                    {configs.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No product configuration available for this order.
                        </p>
                    ) : (
                        configs.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg border border-gray-100 p-3"
                            >
                                <p className="mb-2 text-sm font-medium text-black">
                                    {item.config.productName ?? item.config.productType} · Qty {item.quantity}
                                </p>
                                {renderProductPreview(item.config)}
                                <div className="mt-2">
                                    <ProductConfigSummary productConfig={item.config} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
}
