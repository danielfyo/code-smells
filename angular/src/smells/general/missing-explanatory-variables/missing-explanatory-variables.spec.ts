import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyLoanApprovalService } from './smelly';
import { LoanApprovalService, LoanRequest } from './refactored';

describe('missing-explanatory-variables', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  const base: LoanRequest = { annualIncome: 60000, monthlyDebts: 300, amount: 100000, years: 25, creditScore: 720 };

  it.each<[string, LoanRequest, boolean]>([
    ['good credit, affordable', base, true],
    ['too much debt', { ...base, monthlyDebts: 1500 }, false],
    ['fair credit, small loan', { ...base, creditScore: 650, amount: 80000 }, true],
    ['fair credit, big loan', { ...base, creditScore: 650, amount: 130000, years: 30 }, false],
    ['poor credit', { ...base, creditScore: 550 }, false],
  ])('both versions agree: %s', (_label, request, expected) => {
    expect(TestBed.inject(SmellyLoanApprovalService).isApproved(request)).toBe(expected);
    expect(TestBed.inject(LoanApprovalService).isApproved(request)).toBe(expected);
  });
});
