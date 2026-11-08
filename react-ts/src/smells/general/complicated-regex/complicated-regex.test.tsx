import { isValidBookingCode as smelly } from "./Smelly";
import { isValidBookingCode as refactored } from "./Refactored";

describe("complicated-regex", () => {
  it.each([
    ["MAD-20240315-0042", true],
    ["BCN-20241231-9999-VIP", true],
    ["SVQ-20240101-0001-STD", true],
    ["mad-20240315-0042", false],
    ["MAD-20241315-0042", false],
    ["MAD-20240332-0042", false],
    ["MAD-20240315-42", false],
    ["MAD-20240315-0042-GOLD", false],
  ])("%s -> %s in both versions", (code, expected) => {
    expect(smelly(code)).toBe(expected);
    expect(refactored(code)).toBe(expected);
  });
});
