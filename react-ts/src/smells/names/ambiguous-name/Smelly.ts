export interface Order {
  id: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  total: number;
}

// SMELL: ambiguous name. Does "process" validate? charge? ship? cancel?
// You must read the body to find out it marks the order as paid when the total is positive.
export function process(order: Order): Order {
  if (order.status !== "pending") return order;
  return { ...order, status: order.total > 0 ? "paid" : "cancelled" };
}

// SMELL: "handle" and "data" say nothing: handle what? which data?
export function handle(data: Order[]): Order[] {
  return data.filter((o) => o.status === "paid");
}
