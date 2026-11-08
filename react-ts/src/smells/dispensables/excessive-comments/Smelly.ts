export interface Purchase {
  amount: number;
  date: string; // ISO yyyy-mm-dd
}

// SMELL: Comments as deodorant. The comments try to cover up cryptic code
// (one-letter names, magic numbers, everything on one line) instead of
// rewriting it so it explains itself. On top of that, they age badly.

// calculates the points
export function calc(p: Purchase[], t: number): number {
  let r = 0; // result
  for (const x of p) {
    // 1 point per 10 euros (rounded down)
    let q = Math.floor(x.amount / 10);
    // if it is the weekend (0 = Sunday, 6 = Saturday) points are doubled
    const d = new Date(x.date + "T00:00:00Z").getUTCDay();
    if (d === 0 || d === 6) q = q * 2;
    r += q;
  }
  // t is the tier: 1 = bronze, 2 = silver (+10%), 3 = gold (+25%)
  if (t === 2) r = r * 1.1;
  if (t === 3) r = r * 1.25;
  // round down because we do not give half points
  return Math.floor(r);
}
