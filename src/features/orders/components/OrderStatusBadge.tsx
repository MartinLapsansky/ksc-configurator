import type { OrderStatus } from "@/features/orders/constants";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/features/orders/constants";

type OrderStatusBadgeProps = {
  status: string;
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalized = status.toLowerCase() as OrderStatus;
  const label = ORDER_STATUS_LABELS[normalized];

  if (!label) {
    return (
      <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-500">
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[normalized]}`}
    >
      {label}
    </span>
  );
}