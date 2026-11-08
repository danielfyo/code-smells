// REFACTOR: explicit domain types and "unknown" at the boundary. External data is
// validated on the way in; from then on the compiler watches every access.
export interface OrderItem {
  sku: string;
  qty: number;
}

export interface Order {
  id: string;
  total: number;
  items: OrderItem[];
}

export function formatOrder(order: Order): string {
  const units = order.items.reduce((sum, item) => sum + item.qty, 0);
  return `Order ${order.id}: ${units} units, ${order.total} €`;
}

function isOrderItem(value: unknown): value is OrderItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.sku === "string" && typeof item.qty === "number";
}

function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const order = value as Record<string, unknown>;
  return (
    typeof order.id === "string" &&
    typeof order.total === "number" &&
    Array.isArray(order.items) &&
    order.items.every(isOrderItem)
  );
}

export function parseOrder(json: string): Order {
  const data: unknown = JSON.parse(json);
  if (!isOrder(data)) throw new TypeError("Order has an invalid format");
  return data;
}

export function totalWithTax(order: Order): number {
  return order.total * 1.21;
}
