import { calc } from './smelly';
import { loyaltyPoints, type LoyaltyTier } from './refactored';

const legacyTier: Record<LoyaltyTier, string> = { gold: 'G', silver: 'S', standard: '' };

describe('Comments (as Deodorant)', () => {
  it.each([
    { amountEuros: 95, tier: 'gold', membershipMonths: 3 },
    { amountEuros: 95, tier: 'silver', membershipMonths: 30 },
    { amountEuros: 9, tier: 'standard', membershipMonths: 24 },
  ] as const)('both versions award the same points (%#)', (purchase) => {
    expect(loyaltyPoints(purchase)).toBe(calc(purchase.amountEuros, legacyTier[purchase.tier], purchase.membershipMonths));
  });
});
