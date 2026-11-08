export interface Order {
  id: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  total: number;
}

// REFACTOR: Rename Function. The name describes exactly the effect:
// settles a pending order (paid if it has an amount, cancelled otherwise).
export function settlePendingOrder(order: Order): Order {
  if (order.status !== "pending") return order;
  return { ...order, status: order.total > 0 ? "paid" : "cancelled" };
}

// REFACTOR: the name says what it returns and from which collection.
export function selectPaidOrders(orders: Order[]): Order[] {
  return orders.filter((order) => order.status === "paid");
}
