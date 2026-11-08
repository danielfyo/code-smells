export interface Order {
  id: string;
  customer: string;
  total: number;
}

// SMELL: Flag Argument. `asCsv` makes the function do two different things
// with two different output formats. At the call site, `exportOrders(orders, true)`
// says nothing, and every new format adds another flag.
export function exportOrders(orders: Order[], asCsv: boolean): string {
  if (asCsv) {
    const header = "id,customer,total";
    const rows = orders.map((o) => `${o.id},${o.customer},${o.total.toFixed(2)}`);
    return [header, ...rows].join("\n");
  } else {
    return JSON.stringify(orders.map((o) => ({ id: o.id, customer: o.customer, total: o.total })));
  }
}
