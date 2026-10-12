"use client";

import React from "react";

export default function OrdersError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-black">Orders</h1>
        <p className="mt-6 text-red-600">
          Failed to load orders. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
        >
          Try again
        </button>
      </div>
    </main>
  );
}