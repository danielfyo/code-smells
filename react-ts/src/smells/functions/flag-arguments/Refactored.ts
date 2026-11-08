export interface Order {
  id: string;
  customer: string;
  total: number;
}

// REFACTOR: Remove Flag Argument (Split Function). One explicit function per
// behaviour: the name says which format it produces.
export function exportOrdersAsCsv(orders: readonly Order[]): string {
  const rows = orders.map((o) => `${o.id},${o.customer},${o.total.toFixed(2)}`);
  return ["id,customer,total", ...rows].join("\n");
}

export function exportOrdersAsJson(orders: readonly Order[]): string {
  return JSON.stringify(orders.map(({ id, customer, total }) => ({ id, customer, total })));
}
