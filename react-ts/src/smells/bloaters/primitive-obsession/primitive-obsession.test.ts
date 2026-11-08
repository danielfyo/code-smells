import { splitBill as smellySplit } from "./Smelly";
import { splitBill as refactoredSplit, Money, parseEmail } from "./Refactored";

describe("Primitive Obsession", () => {
  const emails = ["Ana@Mail.com", "bob@mail.com", "eva@mail.com"];

  it("both versions split the bill identically without losing cents", () => {
    const expected = ["ana@mail.com: 33.34 EUR", "bob@mail.com: 33.33 EUR", "eva@mail.com: 33.33 EUR"];
    expect(smellySplit(100, "eur", emails)).toEqual(expected);
    expect(refactoredSplit(100, "eur", emails)).toEqual(expected);
  });

  it("both reject invalid emails and currencies", () => {
    for (const split of [smellySplit, refactoredSplit]) {
      expect(() => split(10, "EUR", ["not-an-email"])).toThrow("Invalid email");
      expect(() => split(10, "EURO", ["a@b.co"])).toThrow("Invalid currency");
      expect(() => split(10, "EUR", [])).toThrow("No participants");
    }
  });

  it("the value objects concentrate the rules", () => {
    expect(Money.of(0.1 + 0.2, "usd").toString()).toBe("0.30 USD");
    expect(Money.of(1, "EUR").allocate(3).map((m) => m.cents)).toEqual([34, 33, 33]);
    expect(parseEmail("X@Y.ES")).toBe("x@y.es");
  });
});
