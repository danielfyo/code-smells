// REFACTOR: literal unions and a union discriminated by "status". Each status carries
// exactly the data it needs, typos don't compile and the switch is exhaustive.
export type Currency = "EUR" | "USD";

interface OrderBase {
  id: string;
  currency: Currency;
  amount: number;
}

export type Order =
  | (OrderBase & { status: "pending" })
  | (OrderBase & { status: "shipped"; trackingCode: string })
  | (OrderBase & { status: "cancelled"; cancelReason: string });

const CURRENCY_SYMBOL: Record<Currency, string> = { EUR: "€", USD: "$" };

function statusText(order: Order): string {
  switch (order.status) {
    case "pending":
      return "Pending";
    case "shipped":
      return `Shipped (${order.trackingCode})`;
    case "cancelled":
      return `Cancelled: ${order.cancelReason}`;
  }
}

export function OrderBadge({ order }: { order: Order }) {
  return (
    <span>
      {statusText(order)} · {order.amount} {CURRENCY_SYMBOL[order.currency]}
    </span>
  );
}
