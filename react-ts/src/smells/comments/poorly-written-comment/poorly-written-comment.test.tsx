import { lateFee as smelly } from "./Smelly";
import { lateFee as refactored } from "./Refactored";

const cases = [
  { amount: 1000, daysOverdue: 0, expected: 0 },
  { amount: 40, daysOverdue: 10, expected: 0 },
  { amount: 200, daysOverdue: 5, expected: 10 },
  { amount: 5000, daysOverdue: 30, expected: 100 },
];

describe("poorly-written-comment", () => {
  it.each(cases)("fee for €$amount with $daysOverdue days overdue = $expected", ({ expected, ...invoice }) => {
    expect(smelly(invoice)).toBe(expected);
    expect(refactored(invoice)).toBe(expected);
  });
});
