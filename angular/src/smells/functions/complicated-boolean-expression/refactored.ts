import type { Basket } from './model';

const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const COUPON_MINIMUM_CENTS = 2000;
const SWISS_MINIMUM_CENTS = 10000;
const HOME_MARKETS = ['ES', 'PT'];

// REFACTOR: Decompose Conditional / Extract Function. Each rule gets a name that states the
// business intent; the final expression reads like the policy document.
const isLargeHomeOrder = (b: Basket): boolean =>
  b.totalCents >= FREE_SHIPPING_THRESHOLD_CENTS && HOME_MARKETS.includes(b.country) && b.oversizedItems === 0;

const isPremiumPerk = (b: Basket): boolean => b.customerTier === 'premium' && b.country !== 'CH' && b.oversizedItems < 2;

const hasShippingCoupon = (b: Basket): boolean =>
  b.couponCode?.toUpperCase() === 'SHIPFREE' && b.totalCents >= COUPON_MINIMUM_CENTS;

const isBlockedBySwissMinimum = (b: Basket): boolean => b.country === 'CH' && b.totalCents < SWISS_MINIMUM_CENTS;

export function hasFreeShipping(b: Basket): boolean {
  const qualifies = isLargeHomeOrder(b) || isPremiumPerk(b) || hasShippingCoupon(b);
  return qualifies && !isBlockedBySwissMinimum(b);
}
