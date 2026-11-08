import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

describe("obvious-behavior-unimplemented", () => {
  it("smelly accepts February 30th and turns it into March", () => {
    expect(smelly.parseDay("2024-02-30").toISOString().slice(0, 10)).toBe("2024-03-01");
    expect(() => refactored.parseDay("2024-02-30")).toThrow(RangeError);
    expect(refactored.parseDay("2024-02-29").toISOString().slice(0, 10)).toBe("2024-02-29");
  });

  it("smelly excludes the last day of the range; refactored includes it", () => {
    const range = { start: refactored.parseDay("2024-07-01"), end: refactored.parseDay("2024-07-07") };
    const lastDay = refactored.parseDay("2024-07-07");
    expect(smelly.contains(range, lastDay)).toBe(false);
    expect(refactored.contains(range, lastDay)).toBe(true);
  });

  it("smelly does not round prices; refactored does", () => {
    expect(smelly.formatPrice(0.1 + 0.2)).toBe("0.30000000000000004 €");
    expect(refactored.formatPrice(0.1 + 0.2)).toBe("0.30 €");
    expect(refactored.formatPrice(-5)).toBe("-5.00 €");
  });
});
