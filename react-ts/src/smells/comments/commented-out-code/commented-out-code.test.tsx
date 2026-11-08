import { availableProducts as smelly } from "./Smelly";
import { availableProducts as refactored } from "./Refactored";

const products = [
  { name: "Keyboard", price: 30, stock: 2 },
  { name: "Mouse", price: 15, stock: 0 },
  { name: "Speaker", price: 0, stock: 5 },
];

describe("commented-out-code", () => {
  it("both versions return in-stock products sorted by name", () => {
    const expected = ["Keyboard", "Speaker"];
    expect(smelly(products).map((p) => p.name)).toEqual(expected);
    expect(refactored(products).map((p) => p.name)).toEqual(expected);
  });
});
