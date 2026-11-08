// REFACTOR: Rename Variable / Extract Function / Replace Magic Literal. The code now explains
// itself, so the comments that only paraphrased it are gone.
export type LoyaltyTier = 'gold' | 'silver' | 'standard';

const EUROS_PER_POINT = 10;
const TIER_MULTIPLIER: Record<LoyaltyTier, number> = { gold: 2, silver: 1.5, standard: 1 };
const VETERAN_MONTHS = 24;
const VETERAN_BONUS_POINTS = 20;

export interface Purchase {
  amountEuros: number;
  tier: LoyaltyTier;
  membershipMonths: number;
}

function basePoints(amountEuros: number): number {
  return Math.floor(amountEuros / EUROS_PER_POINT);
}

function veteranBonus(membershipMonths: number): number {
  return membershipMonths >= VETERAN_MONTHS ? VETERAN_BONUS_POINTS : 0;
}

export function loyaltyPoints({ amountEuros, tier, membershipMonths }: Purchase): number {
  return Math.round(basePoints(amountEuros) * TIER_MULTIPLIER[tier]) + veteranBonus(membershipMonths);
}
