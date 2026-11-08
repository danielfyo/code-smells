import { orderTotal as smellyTotal } from "./Smelly";
import { orderTotal as refactoredTotal } from "./Refactored";

const lines = [
  { price: 10.5, quantity: 2 },
  { price: 3.333, quantity: 3 },
];

describe("inappropriate-information", () => {
  it.each([
    ["smelly", smellyTotal],
    ["refactored", refactoredTotal],
  ])("%s computes the discounted total rounded to cents", (_name, total) => {
    expect(total(lines, 0.1)).toBe(27.9);
    expect(total([], 0.5)).toBe(0);
  });

  it("both versions are equivalent", () => {
    expect(refactoredTotal(lines, 0.25)).toBe(smellyTotal(lines, 0.25));
  });
});
