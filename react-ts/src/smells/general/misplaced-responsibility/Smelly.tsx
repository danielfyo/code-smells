// SMELL: misplaced responsibility. The "VAT and free shipping" rule lives inside a
// presentational component (CartFooter) because that was convenient for the author.
// Any other place that needs the total (confirmation email, checkout) will have to
// copy it or import a component to do arithmetic.
export interface CartLine {
  price: number;
  quantity: number;
}

export function CartFooter({ lines }: { lines: CartLine[] }) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const vat = subtotal * 0.21;
  const shipping = subtotal >= 50 ? 0 : 4.95;
  const total = subtotal + vat + shipping;
  return (
    <footer>
      <p>Shipping: {shipping === 0 ? "free" : `${shipping.toFixed(2)} €`}</p>
      <p>Total: {total.toFixed(2)} €</p>
    </footer>
  );
}
