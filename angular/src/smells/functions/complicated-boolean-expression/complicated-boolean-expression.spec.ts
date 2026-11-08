import type { Basket } from './model';
import { hasFreeShipping as smelly } from './smelly';
import { hasFreeShipping } from './refactored';

const base: Basket = { totalCents: 6000, country: 'ES', oversizedItems: 0, customerTier: 'basic' };

describe('Complicated Boolean Expression', () => {
  it.each<Basket>([
    base,
    { ...base, oversizedItems: 1 },
    { ...base, country: 'FR' },
    { ...base, country: 'FR', customerTier: 'premium' },
    { ...base, country: 'CH', customerTier: 'premium' },
    { ...base, country: 'FR', totalCents: 2500, couponCode: 'shipfree' },
    { ...base, country: 'CH', totalCents: 2500, couponCode: 'SHIPFREE' },
    { ...base, country: 'CH', totalCents: 12000, couponCode: 'SHIPFREE' },
  ])('both versions agree (%#)', (basket) => {
    expect(hasFreeShipping(basket)).toBe(smelly(basket));
  });
});
