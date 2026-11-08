import type { LoanApplication } from './model';

const MAX_INCOME_MULTIPLIER = 10;

// REFACTOR: Replace Nested Conditional with Guard Clauses. Every rejection exits early, right
// next to its condition; the main path reads top to bottom at a single indentation level.
export function assessLoan(app: LoanApplication): string {
  if (app.age < 18) return 'Rejected: applicant under 18';
  if (!app.employed) return 'Rejected: no employment';
  if (app.hasDefaults) return 'Rejected: previous defaults';
  if (app.requestedAmount <= 0) return 'Rejected: invalid amount';
  if (app.requestedAmount > app.monthlyIncome * MAX_INCOME_MULTIPLIER) return 'Rejected: amount too high for income';
  return 'Approved';
}
