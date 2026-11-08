import { calc } from "./Smelly";
import { loyaltyPoints, basePoints, type Tier } from "./Refactored";

const purchases = [
  { amount: 57, date: "2026-03-07" }, // Saturday → 5 * 2
  { amount: 123, date: "2026-03-09" }, // Monday → 12
  { amount: 9, date: "2026-03-08" }, // Sunday → 0
];

describe("Comments as deodorant", () => {
  it.each([
    [1, "bronze"],
    [2, "silver"],
    [3, "gold"],
  ] as [number, Tier][])("tier %i is equivalent to %s", (legacyTier, tier) => {
    expect(loyaltyPoints(purchases, tier)).toBe(calc(purchases, legacyTier));
  });

  it("computes the expected points", () => {
    expect(basePoints(purchases[0])).toBe(10);
    expect(loyaltyPoints(purchases, "gold")).toBe(27); // 22 * 1.25 = 27.5
  });
});
