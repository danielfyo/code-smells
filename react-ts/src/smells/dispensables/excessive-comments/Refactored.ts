export interface Purchase {
  amount: number;
  date: string; // ISO yyyy-mm-dd
}

// REFACTOR: Rename Variable + Extract Function + Replace Magic Number with
// Symbolic Constant. What the comments used to explain is now said by the
// names themselves; only a comment explaining the "why" remains.
export type Tier = "bronze" | "silver" | "gold";

const EUROS_PER_POINT = 10;
const WEEKEND_MULTIPLIER = 2;
const TIER_BONUS: Record<Tier, number> = { bronze: 1, silver: 1.1, gold: 1.25 };

const isWeekend = (isoDate: string): boolean => {
  const day = new Date(`${isoDate}T00:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
};

export function basePoints(purchase: Purchase): number {
  const points = Math.floor(purchase.amount / EUROS_PER_POINT);
  return isWeekend(purchase.date) ? points * WEEKEND_MULTIPLIER : points;
}

export function loyaltyPoints(purchases: Purchase[], tier: Tier): number {
  const total = purchases.reduce((sum, p) => sum + basePoints(p), 0);
  // Fractions of a point are never awarded.
  return Math.floor(total * TIER_BONUS[tier]);
}
