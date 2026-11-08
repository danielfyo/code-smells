import { Injectable } from '@angular/core';

export interface LoanRequest {
  annualIncome: number;
  monthlyDebts: number;
  amount: number;
  years: number;
  creditScore: number;
}

const ANNUAL_INTEREST = 0.05;
const MAX_DEBT_TO_INCOME = 0.35;
const GOOD_CREDIT = 700;
const FAIR_CREDIT = 600;
const FAIR_CREDIT_MAX_INCOME_MULTIPLE = 2;

@Injectable({ providedIn: 'root' })
export class LoanApprovalService {
  // REFACTOR: Extract Variable. Each sub-expression gets a name that explains its role, so the
  // final condition reads like the lending policy itself.
  isApproved(request: LoanRequest): boolean {
    const monthlyRate = ANNUAL_INTEREST / 12;
    const numberOfPayments = request.years * 12;
    const monthlyInstalment = (request.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const monthlyIncome = request.annualIncome / 12;
    const debtToIncome = (request.monthlyDebts + monthlyInstalment) / monthlyIncome;

    const affordable = debtToIncome < MAX_DEBT_TO_INCOME;
    const hasGoodCredit = request.creditScore >= GOOD_CREDIT;
    const isSmallLoanWithFairCredit =
      request.creditScore >= FAIR_CREDIT && request.amount < request.annualIncome * FAIR_CREDIT_MAX_INCOME_MULTIPLE;

    return affordable && (hasGoodCredit || isSmallLoanWithFairCredit);
  }
}
