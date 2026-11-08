export interface Basket {
  subtotal: number;
  items: number;
  country: string;
  hasOversizedItem: boolean;
  customer: { isPremium: boolean; ordersLastYear: number };
  coupon?: string;
}

// REFACTOR: Decompose Conditional + Extract Variable. Each piece of the
// condition is a function named after the business rule it represents.
const SHIPPING_COUNTRIES = new Set(["ES", "PT"]);
const FREE_SHIPPING_MIN = 50;
const PREMIUM_FREE_SHIPPING_MIN = 20;
const LOYAL_CUSTOMER_ORDERS = 10;

const shipsToEligibleCountry = (b: Basket) => SHIPPING_COUNTRIES.has(b.country) && !b.hasOversizedItem;
const reachesMinimum = (b: Basket) => b.items > 0 && b.subtotal >= FREE_SHIPPING_MIN;
const isPremiumAboveMinimum = (b: Basket) => b.customer.isPremium && b.subtotal >= PREMIUM_FREE_SHIPPING_MIN;
const isLoyalCustomer = (b: Basket) => b.customer.ordersLastYear >= LOYAL_CUSTOMER_ORDERS;
const hasFreeShippingCoupon = (b: Basket) => b.coupon?.toUpperCase() === "FREESHIP";

export function qualifiesForFreeShipping(b: Basket): boolean {
  if (!shipsToEligibleCountry(b)) return false;
  return reachesMinimum(b) || isPremiumAboveMinimum(b) || isLoyalCustomer(b) || hasFreeShippingCoupon(b);
}

export function FreeShippingBanner({ basket }: { basket: Basket }) {
  return <p role="status">{qualifiesForFreeShipping(basket) ? "Free shipping!" : "Shipping: 4.95 €"}</p>;
}
