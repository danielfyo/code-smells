export interface Order {
  total: number;
  shipping: number;
  discount: number;
}

// REFACTOR: one canonical way to solve the problem, reused everywhere.
// If the format changes, it changes in a single place.
const euroFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  useGrouping: false,
});

export function formatEuros(amount: number): string {
  return euroFormatter.format(amount);
}

export const orderTotalLabel = (order: Order): string => formatEuros(order.total);
export const shippingLabel = (order: Order): string => formatEuros(order.shipping);
export const discountLabel = (order: Order): string => formatEuros(order.discount);
