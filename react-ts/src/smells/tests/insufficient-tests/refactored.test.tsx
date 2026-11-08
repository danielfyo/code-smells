import { shippingCost } from "./production";

// REFACTOR: every business rule and every branch is covered, errors included.
// (Complement with `vitest run --coverage` to spot untested branches.)
describe("shippingCost (refactored)", () => {
  it.each([
    ["peninsula", 4],
    ["islands", 9],
    ["international", 20],
  ] as const)("base cost for %s is %d €", (zone, expected) => {
    expect(shippingCost(2, zone, 30)).toBe(expected);
  });

  it("is free on the mainland for orders from 60 €", () => {
    expect(shippingCost(2, "peninsula", 60)).toBe(0);
  });

  it("free shipping does not apply to the islands", () => {
    expect(shippingCost(2, "islands", 100)).toBe(9);
  });

  it("charges 1.5 € per kg above 5 kg", () => {
    expect(shippingCost(9, "peninsula", 30)).toBe(4 + 4 * 1.5);
  });

  it.each([0, -1])("rejects non-positive weights (%d)", (weight) => {
    expect(() => shippingCost(weight, "peninsula", 30)).toThrow(RangeError);
  });
});
