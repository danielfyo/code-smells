import { bookingPrice as smelly } from "./Smelly";
import { bookingPrice as refactored } from "./Refactored";

describe("obsolete-comment", () => {
  it("the real behavior contradicts the obsolete comment (€1/night, 5%)", () => {
    // According to the comment it would be 3*100 + 3*1 = 303; the code charges per guest.
    expect(smelly({ nights: 3, nightlyRate: 100, guests: 2 })).toBe(315);
  });

  it.each([
    { nights: 3, nightlyRate: 100, guests: 2, expected: 315 },
    { nights: 7, nightlyRate: 100, guests: 1, expected: 647.5 },
  ])("both versions compute $expected", ({ expected, ...booking }) => {
    expect(smelly(booking)).toBe(expected);
    expect(refactored(booking)).toBe(expected);
  });
});
