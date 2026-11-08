import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

// Intl uses a non-breaking space before the symbol: normalize it to compare.
const normalize = (label: string) => label.replace(/\s/g, " ");
const order = { total: 12.5, shipping: 4.95, discount: 1.239 };

describe("oddball-solution", () => {
  it("smelly gives inconsistent results depending on the call site", () => {
    expect(normalize(smelly.orderTotalLabel(order))).toBe("12,50 €");
    expect(normalize(smelly.discountLabel(order))).toBe("1,23 €"); // truncates instead of rounding
  });

  it("refactored formats everything the same way", () => {
    expect(normalize(refactored.orderTotalLabel(order))).toBe("12,50 €");
    expect(normalize(refactored.shippingLabel(order))).toBe(normalize(smelly.shippingLabel(order)));
    expect(normalize(refactored.discountLabel(order))).toBe("1,24 €");
  });
});
