// SMELL: stringly typed. status and currency are plain "string": typos ("shiped", "eur")
// compile, there is no autocompletion and every consumer reinvents the valid values.
// Data tied to each status (trackingCode) is always optional.
export interface Order {
  id: string;
  status: string; // "pending" | "shipped" | "cancelled"... depending on whoever wrote the comment
  currency: string;
  amount: number;
  trackingCode?: string;
  cancelReason?: string;
}

export function OrderBadge({ order }: { order: Order }) {
  let text: string;
  if (order.status === "pending") text = "Pending";
  else if (order.status === "shipped") text = `Shipped (${order.trackingCode})`;
  else if (order.status === "cancelled") text = `Cancelled: ${order.cancelReason}`;
  else text = "Unknown"; // SMELL: a branch for "whatever comes in"
  const symbol = order.currency === "EUR" ? "€" : order.currency === "USD" ? "$" : "?";
  return (
    <span>
      {text} · {order.amount} {symbol}
    </span>
  );
}
