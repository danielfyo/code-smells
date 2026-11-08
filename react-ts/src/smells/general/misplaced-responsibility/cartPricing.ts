// REFACTOR: Move Function. Pricing rules live in a pure domain module,
// where any reader would look for them and any consumer can reuse them.
export interface CartLine {
  price: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
}

const VAT_RATE = 0.21;
const FREE_SHIPPING_FROM = 50;
const SHIPPING_FEE = 4.95;

export function calculateCartTotals(lines: CartLine[]): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  return { subtotal, vat, shipping, total: subtotal + vat + shipping };
}
