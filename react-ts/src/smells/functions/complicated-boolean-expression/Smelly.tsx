export interface Basket {
  subtotal: number;
  items: number;
  country: string;
  hasOversizedItem: boolean;
  customer: { isPremium: boolean; ordersLastYear: number };
  coupon?: string;
}

// SMELL: Complicated Boolean Expression. A single five-line condition with
// nested parentheses decides whether shipping is free. Nobody dares to touch it
// and it is very hard to tell which business rule each piece represents.
export function FreeShippingBanner({ basket }: { basket: Basket }) {
  if (
    !basket.hasOversizedItem &&
    (basket.country === "ES" || basket.country === "PT") &&
    ((basket.subtotal >= 50 && basket.items > 0) ||
      (basket.customer.isPremium && basket.subtotal >= 20) ||
      basket.customer.ordersLastYear >= 10 ||
      (basket.coupon !== undefined && basket.coupon.toUpperCase() === "FREESHIP"))
  ) {
    return <p role="status">Free shipping!</p>;
  }
  return <p role="status">Shipping: 4.95 €</p>;
}
