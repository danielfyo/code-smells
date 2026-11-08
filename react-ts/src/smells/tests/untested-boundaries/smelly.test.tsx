import { fareForAge } from "./production";

// SMELL: untested boundaries. Only "comfortable" values from the middle of each band are
// used. A "<" vs "<=" bug at 4, 18 or 65 (where bugs usually live) would go unnoticed,
// as would failing to validate negative or fractional ages.
describe("fareForAge (smelly)", () => {
  it("child", () => {
    expect(fareForAge(10)).toBe("child");
  });

  it("adult", () => {
    expect(fareForAge(40)).toBe("adult");
  });

  it("senior", () => {
    expect(fareForAge(80)).toBe("senior");
  });
});
