import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

describe("convention-over-structure", () => {
  it("known kinds render the same in both versions", () => {
    for (const kind of ["order", "payment"] as const) {
      expect(refactored.iconFor(kind)).toBe(smelly.iconFor(kind));
      expect(refactored.labelFor(kind)).toBe(smelly.labelFor(kind));
    }
  });

  it("smelly forgot a case: 'refund' has an icon but a generic label", () => {
    expect(smelly.iconFor("refund")).toBe("↩️");
    expect(smelly.labelFor("refund")).toBe("Notification");
    expect(refactored.labelFor("refund")).toBe("Refund issued");
  });
});
