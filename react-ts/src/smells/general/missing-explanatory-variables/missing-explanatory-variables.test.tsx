import { isLoanApproved as smelly } from "./Smelly";
import { isLoanApproved as refactored } from "./Refactored";

const base = { annualIncome: 48000, monthlyDebts: 300, amount: 60000, years: 20, creditScore: 720 };

describe("missing-explanatory-variables", () => {
  it.each([
    { ...base, expected: true },
    { ...base, monthlyDebts: 1200, expected: false },
    { ...base, creditScore: 650, expected: true },
    { ...base, creditScore: 650, amount: 100000, years: 30, expected: false },
    { ...base, creditScore: 550, expected: false },
  ])("both versions decide the same (score $creditScore, debts $monthlyDebts)", ({ expected, ...request }) => {
    expect(smelly(request)).toBe(expected);
    expect(refactored(request)).toBe(expected);
  });
});
