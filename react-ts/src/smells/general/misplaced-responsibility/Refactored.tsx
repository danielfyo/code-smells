import { calculateCartTotals, type CartLine } from "./cartPricing";

// REFACTOR: the component only presents; the calculation is delegated to the domain module.
export function CartFooter({ lines }: { lines: CartLine[] }) {
  const { shipping, total } = calculateCartTotals(lines);
  return (
    <footer>
      <p>Shipping: {shipping === 0 ? "free" : `${shipping.toFixed(2)} €`}</p>
      <p>Total: {total.toFixed(2)} €</p>
    </footer>
  );
}
