/**
 * Formats an order's numeric sequence into the human-facing reference used in
 * customer communications, e.g. `Cust-enq-00001`.
 */
export function formatOrderNumber(orderNumber: number): string {
  return `Cust-enq-${String(orderNumber).padStart(5, "0")}`;
}