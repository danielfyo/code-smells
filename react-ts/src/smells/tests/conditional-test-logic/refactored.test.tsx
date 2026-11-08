import { orderPriority } from "./production";

// REFACTOR: no logic in tests. Each case is an explicit data row
// (input -> expected output) and exceptions are checked with toThrow.
describe("orderPriority (refactored)", () => {
  it.each([
    [50, false, "low"],
    [100, false, "normal"],
    [499, false, "normal"],
    [500, false, "high"],
    [10, true, "high"],
  ] as const)("total %d (premium: %s) -> %s", (total, isPremium, expected) => {
    expect(orderPriority(total, isPremium)).toBe(expected);
  });

  it("rejects negative totals", () => {
    expect(() => orderPriority(-1, false)).toThrow(RangeError);
  });
});
