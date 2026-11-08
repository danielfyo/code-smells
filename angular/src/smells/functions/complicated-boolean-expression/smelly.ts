import type { Basket } from './model';

// SMELL: Complicated Boolean Expression. One condition mixes thresholds, countries, item types,
// customer tiers and coupons. Nobody can say at a glance when shipping is free, or spot the
// missing parenthesis that would change everything.
export function hasFreeShipping(b: Basket): boolean {
  return (
    ((b.totalCents >= 5000 && (b.country === 'ES' || b.country === 'PT') && b.oversizedItems === 0) ||
      (b.customerTier === 'premium' && b.country !== 'CH' && b.oversizedItems < 2) ||
      (b.couponCode !== undefined && b.couponCode.toUpperCase() === 'SHIPFREE' && b.totalCents >= 2000)) &&
    !(b.country === 'CH' && b.totalCents < 10000)
  );
}
