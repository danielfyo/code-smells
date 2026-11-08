import type { LoanApplication } from './model';
import { assessLoan as smelly } from './smelly';
import { assessLoan } from './refactored';

const ok: LoanApplication = { age: 30, monthlyIncome: 2000, requestedAmount: 15000, hasDefaults: false, employed: true };

describe('Deep Nesting', () => {
  it.each<LoanApplication>([
    ok,
    { ...ok, age: 17 },
    { ...ok, employed: false },
    { ...ok, hasDefaults: true },
    { ...ok, requestedAmount: 0 },
    { ...ok, requestedAmount: 25000 },
  ])('both versions reach the same decision (%#)', (app) => {
    expect(assessLoan(app)).toBe(smelly(app));
  });

  it('approves a sound application', () => {
    expect(assessLoan(ok)).toBe('Approved');
  });
});
