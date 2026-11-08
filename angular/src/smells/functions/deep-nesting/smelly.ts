import type { LoanApplication } from './model';

// SMELL: Deep Nesting / Arrow Code. Five levels of if/else. The happy path ("approved") sits at
// the deepest indentation and each rejection reason is far from the condition that causes it.
export function assessLoan(app: LoanApplication): string {
  if (app.age >= 18) {
    if (app.employed) {
      if (!app.hasDefaults) {
        if (app.requestedAmount > 0) {
          if (app.requestedAmount <= app.monthlyIncome * 10) {
            return 'Approved';
          } else {
            return 'Rejected: amount too high for income';
          }
        } else {
          return 'Rejected: invalid amount';
        }
      } else {
        return 'Rejected: previous defaults';
      }
    } else {
      return 'Rejected: no employment';
    }
  } else {
    return 'Rejected: applicant under 18';
  }
}
