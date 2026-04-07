"use client";

import React, { useState } from "react";
import type { Order } from "@/types/preview";
import JerseyConfigSummary from "./JerseyConfigSummary";

type OrderCardProps = {
  order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
  const [open, setOpen] = useState(false);

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
          <span className="font-medium">Lead time:</span> {order.leadTime}
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
        <div className="mt-4 border-t border-gray-200 pt-4">
          <JerseyConfigSummary jerseyConfig={order.jerseyConfig} />
        </div>
      )}
    </div>
  );
}