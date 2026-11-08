// SMELL: oddball solution. The same problem (formatting euro amounts) is solved in three
// different ways in three places. Each one has its own quirks.
export interface Order {
  total: number;
  shipping: number;
  discount: number;
}

export function orderTotalLabel(order: Order): string {
  return order.total.toFixed(2).replace(".", ",") + " €";
}

export function shippingLabel(order: Order): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(order.shipping);
}

export function discountLabel(order: Order): string {
  const [int, dec = ""] = String(order.discount).split(".");
  return `${int},${(dec + "00").slice(0, 2)} €`; // SMELL: truncates instead of rounding
}
