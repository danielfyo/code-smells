import { fareForAge } from "./production";

// REFACTOR: the boundary values of each band are tested (just before and exactly at the
// limit) as well as invalid inputs.
describe("fareForAge (refactored)", () => {
  it.each([
    [0, "free"],
    [3, "free"],
    [4, "child"],
    [17, "child"],
    [18, "adult"],
    [64, "adult"],
    [65, "senior"],
  ] as const)("at age %d the fare is %s", (age, fare) => {
    expect(fareForAge(age)).toBe(fare);
  });

  it.each([-1, 17.5, Number.NaN])("rejects the invalid age %s", (age) => {
    expect(() => fareForAge(age)).toThrow(RangeError);
  });
});
