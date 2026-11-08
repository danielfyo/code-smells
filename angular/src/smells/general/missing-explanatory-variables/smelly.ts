import { Injectable } from '@angular/core';

export interface LoanRequest {
  annualIncome: number;
  monthlyDebts: number;
  amount: number;
  years: number;
  creditScore: number;
}

@Injectable({ providedIn: 'root' })
export class SmellyLoanApprovalService {
  // SMELL: missing explanatory variables. One expression mixes the monthly instalment formula,
  // the debt-to-income ratio and the credit-score rules. Which part is which? What is 0.35?
  isApproved(r: LoanRequest): boolean {
    return (
      (r.monthlyDebts + (r.amount * (0.05 / 12)) / (1 - Math.pow(1 + 0.05 / 12, -r.years * 12))) / (r.annualIncome / 12) < 0.35 &&
      (r.creditScore >= 700 || (r.creditScore >= 600 && r.amount < r.annualIncome * 2))
    );
  }
}
