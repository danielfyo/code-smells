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

// SMELL: Long Method. A single component computes subtotals, validates coupons,
// applies taxes, decides shipping, formats amounts AND renders the UI.
// Every new responsibility makes it longer and nothing can be tested in isolation.
export function CheckoutSummary({ items, couponCode, country }: CheckoutSummaryProps) {
  // SMELL: block 1 — subtotal computed by hand inside the render.
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].unitPrice * items[i].quantity;
  }

  // SMELL: block 2 — coupon rules mixed with everything else.
  let discount = 0;
  if (couponCode) {
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      discount = subtotal * 0.1;
    } else if (code === "FLAT5" && subtotal >= 20) {
      discount = 5;
    }
  }
  const afterDiscount = subtotal - discount;

  // SMELL: block 3 — hard-coded tax table.
  let taxRate = 0.21;
  if (country === "PT") {
    taxRate = 0.23;
  } else if (country === "US") {
    taxRate = 0;
  }
  const tax = afterDiscount * taxRate;

  // SMELL: block 4 — shipping policy hidden in the middle of the component.
  let shipping = 4.99;
  if (afterDiscount >= 50) {
    shipping = 0;
  }
  const total = afterDiscount + tax + shipping;

  // SMELL: block 5 — formatting repeated inline several times.
  return (
    <section aria-label="checkout-summary">
      <ul>
        {items.map((item) => (
          <li key={item.sku}>
            {item.name} x{item.quantity}: {(item.unitPrice * item.quantity).toFixed(2)} €
          </li>
        ))}
      </ul>
      <p>Subtotal: {subtotal.toFixed(2)} €</p>
      {discount > 0 && <p>Discount: -{discount.toFixed(2)} €</p>}
      <p>Taxes: {tax.toFixed(2)} €</p>
      <p>Shipping: {shipping === 0 ? "Free" : `${shipping.toFixed(2)} €`}</p>
      <p>Total: {total.toFixed(2)} €</p>
    </section>
  );
}
