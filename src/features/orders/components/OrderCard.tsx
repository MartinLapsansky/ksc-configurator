"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import type { Order, ProductConfig } from "@/types/preview";
import ProductConfigSummary from "./ProductConfigSummary";
import OrderStatusBadge from "./OrderStatusBadge";
import { updateOrderStatus } from "@/features/orders/actions/updateOrderStatus";
import {
  ORDER_STATUSES,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "@/features/orders/constants";

import GenericOrderPreview from "./productViews/GenericOrderPreview";

type OrderCardProps = {
  order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const renderProductPreview = (productConfig: ProductConfig) => {
    if (productConfig.definitionSnapshot) {
      return <GenericOrderPreview productConfig={productConfig} />;
    }
  };

  const configs = order.items?.length
    ? order.items
    : order.productConfig
      ? [{ id: order.id, quantity: order.quantity, config: order.productConfig }]
      : [];

  const handleStatusChange = (nextStatus: string) => {
    setStatusMenuOpen(false);

    if (nextStatus === status) return;

    setStatus(nextStatus);

    startTransition(async () => {
      const result = await updateOrderStatus({
        orderId: order.id,
        status: nextStatus,
      });

      if (!result.ok) {
        setStatus(order.status);
      }

      router.refresh();
    });
  };

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full flex-col gap-3 pr-10 text-left md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold text-black">
            {order.firstName} {order.lastName}
          </h2>
          <p className="text-sm text-gray-600">
            {order.email} · {order.phoneCountryCode} {order.phoneNumber}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          Status: <OrderStatusBadge status={status} />
        </div>
      </button>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Collapse order details" : "Expand order details"}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
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
                  {item.config.productName ?? item.config.productType} · Qty{" "}
                  {item.quantity}
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

      <div className="relative mt-4 flex justify-end">
        {statusMenuOpen && (
          <button
            type="button"
            aria-label="Close status menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setStatusMenuOpen(false)}
          />
        )}

        <div className="relative z-20">
          <button
            type="button"
            onClick={() => setStatusMenuOpen((prev) => !prev)}
            disabled={isPending}
            aria-haspopup="menu"
            aria-expanded={statusMenuOpen}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black transition-colors hover:bg-gray-50"
          >
            <OrderStatusBadge status={status} />
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${statusMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {statusMenuOpen && (
            <div
              role="menu"
              className="absolute bottom-full right-0 z-30 mb-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            >
              {ORDER_STATUSES.map((statusValue) => {
                const isActive = statusValue === status;

                return (
                  <button
                    key={statusValue}
                    type="button"
                    role="menuitem"
                    onClick={() => handleStatusChange(statusValue)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                      isActive ? "bg-gray-50" : ""
                    }`}
                  >
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[statusValue]}`}
                    >
                      {ORDER_STATUS_LABELS[statusValue]}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-xs font-medium text-gray-500">
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}