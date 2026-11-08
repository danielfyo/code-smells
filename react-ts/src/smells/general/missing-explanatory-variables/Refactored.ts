export interface LoanRequest {
  annualIncome: number;
  monthlyDebts: number;
  amount: number;
  years: number;
  creditScore: number;
}

const ANNUAL_INTEREST_RATE = 0.05;
const MAX_DEBT_TO_INCOME = 0.35;
const GOOD_CREDIT_SCORE = 700;
const FAIR_CREDIT_SCORE = 600;
const FAIR_CREDIT_MAX_INCOME_MULTIPLE = 2;

// REFACTOR: Extract Variable. Each subexpression gets a name explaining what it computes.
export function isLoanApproved(request: LoanRequest): boolean {
  const monthlyRate = ANNUAL_INTEREST_RATE / 12;
  const numberOfPayments = request.years * 12;
  const monthlyInstallment = (request.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  const monthlyIncome = request.annualIncome / 12;
  const debtToIncomeRatio = (request.monthlyDebts + monthlyInstallment) / monthlyIncome;

  const isAffordable = debtToIncomeRatio < MAX_DEBT_TO_INCOME;
  const hasGoodCredit = request.creditScore >= GOOD_CREDIT_SCORE;
  const hasFairCreditForModestAmount =
    request.creditScore >= FAIR_CREDIT_SCORE && request.amount < request.annualIncome * FAIR_CREDIT_MAX_INCOME_MULTIPLE;

  return isAffordable && (hasGoodCredit || hasFairCreditForModestAmount);
}
