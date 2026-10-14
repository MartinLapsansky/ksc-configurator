"use client";

import { useRouter } from "next/navigation";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/features/orders/constants";

type OrdersFiltersProps = {
  from: string;
  status: string;
};

export default function OrdersFilters({ from, status }: OrdersFiltersProps) {
  const router = useRouter();

  const applyFilter = (name: string, value: string) => {
    const params = new URLSearchParams();

    if (from && name !== "from") {
      params.set("from", from);
    }
    if (status && name !== "status") {
      params.set("status", status);
    }

    if (value) {
      params.set(name, value);
    }

    const query = params.toString();
    router.replace(query ? `/orders?${query}` : "/orders");
  };

  const resetFilters = () => {
    router.replace("/orders");
  };

  return (
    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end">
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        From date
        <input
          type="date"
          defaultValue={from}
          onChange={(event) => applyFilter("from", event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-black"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Status
        <select
          defaultValue={status}
          onChange={(event) => applyFilter("status", event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-black"
        >
          <option value="">All</option>
          {ORDER_STATUSES.map((statusValue) => (
            <option key={statusValue} value={statusValue}>
              {ORDER_STATUS_LABELS[statusValue]}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={resetFilters}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
      >
        Reset
      </button>
    </div>
  );
}