import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

describe("imprecision", () => {
  it("smelly: €0.10 + €0.20 is not considered paid with €0.30", () => {
    expect(smelly.isFullyPaid({ customerEmail: "a@b.com", lines: [0.1, 0.2] }, 0.3)).toBe(false);
  });

  it("refactored: with integer cents the comparison is exact", () => {
    const { toCents } = refactored;
    const invoice = { customerEmail: "a@b.com", lines: [toCents(0.1), toCents(0.2)] };
    expect(refactored.isFullyPaid(invoice, toCents(0.3))).toBe(true);
  });

  it("smelly silently returns the first match; refactored detects duplicates", () => {
    const smellyInvoices = [
      { customerEmail: "a@b.com", lines: [1] },
      { customerEmail: "a@b.com", lines: [2] },
    ];
    expect(smelly.findInvoiceByEmail(smellyInvoices, "a@b.com").lines).toEqual([1]);
    expect(() => refactored.findInvoiceByEmail(smellyInvoices, "a@b.com")).toThrow("Found 2 invoices");
    expect(refactored.findInvoiceByEmail(smellyInvoices, "x@y.com")).toBeUndefined();
  });
});
