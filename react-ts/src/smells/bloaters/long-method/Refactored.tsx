export interface CartItem {
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface CheckoutSummaryProps {
  items: CartItem[];
  couponCode?: string;
  country: string;
}

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 4.99;
const TAX_RATES: Record<string, number> = { PT: 0.23, US: 0 };
const DEFAULT_TAX_RATE = 0.21;

// REFACTOR: Extract Function. Each block of the long method is now a named
// pure function that can be read and tested in isolation.
export const lineTotal = (item: CartItem): number => item.unitPrice * item.quantity;

export const subtotalOf = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + lineTotal(item), 0);

export function couponDiscount(subtotal: number, couponCode?: string): number {
  const code = couponCode?.trim().toUpperCase();
  if (code === "WELCOME10") return subtotal * 0.1;
  if (code === "FLAT5" && subtotal >= 20) return 5;
  return 0;
}

export const taxRateFor = (country: string): number => TAX_RATES[country] ?? DEFAULT_TAX_RATE;

export const shippingFor = (amount: number): number =>
  amount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;

const euros = (amount: number): string => `${amount.toFixed(2)} €`;

// REFACTOR: Extract Component. The main component only orchestrates:
// it computes through named functions and delegates presentation.
export function CheckoutSummary({ items, couponCode, country }: CheckoutSummaryProps) {
  const subtotal = subtotalOf(items);
  const discount = couponDiscount(subtotal, couponCode);
  const taxable = subtotal - discount;
  const tax = taxable * taxRateFor(country);
  const shipping = shippingFor(taxable);
  const total = taxable + tax + shipping;

  return (
    <section aria-label="checkout-summary">
      <ItemList items={items} />
      <p>Subtotal: {euros(subtotal)}</p>
      {discount > 0 && <p>Discount: -{euros(discount)}</p>}
      <p>Taxes: {euros(tax)}</p>
      <p>Shipping: {shipping === 0 ? "Free" : euros(shipping)}</p>
      <p>Total: {euros(total)}</p>
    </section>
  );
}

function ItemList({ items }: { items: CartItem[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.sku}>
          {item.name} x{item.quantity}: {euros(lineTotal(item))}
        </li>
      ))}
    </ul>
  );
}
