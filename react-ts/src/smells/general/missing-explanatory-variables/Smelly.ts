export interface LoanRequest {
  annualIncome: number;
  monthlyDebts: number;
  amount: number;
  years: number;
  creditScore: number;
}

// SMELL: missing explanatory variables. One huge expression mixes the monthly payment,
// the debt-to-income ratio and scoring thresholds without naming any of the pieces.
export function isLoanApproved(r: LoanRequest): boolean {
  return (
    (r.monthlyDebts + (r.amount * (0.05 / 12)) / (1 - Math.pow(1 + 0.05 / 12, -r.years * 12))) / (r.annualIncome / 12) <
      0.35 &&
    (r.creditScore >= 700 || (r.creditScore >= 600 && r.amount < r.annualIncome * 2))
  );
}
