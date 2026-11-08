import { ShippingQuoter as SmellyQuoter } from "./Smelly";
import { ShippingQuoter as RefactoredQuoter } from "./Refactored";

const shipments = [
  { weightKg: 2, distanceKm: 100, express: false },
  { weightKg: 5, distanceKm: 300, express: true },
];

describe("Temporary Field", () => {
  it("both versions produce the same quote", () => {
    const smelly = new SmellyQuoter();
    const refactored = new RefactoredQuoter();
    for (const s of shipments) {
      expect(refactored.quote(s)).toEqual(smelly.quote(s));
    }
    expect(refactored.quote(shipments[1])).toEqual({ total: 33, breakdown: ["base:22.00", "express:11.00"] });
  });

  it("the smelly version leaves temporary fields holding leftovers from the last call", () => {
    const smelly = new SmellyQuoter();
    smelly.quote(shipments[1]);
    smelly.quote(shipments[0]);
    expect(smelly.baseCost).toBe(9.6); // leftover state visible from outside
    expect(Object.keys(new RefactoredQuoter())).toEqual([]); // stateless
  });
});
