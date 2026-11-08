import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LoyaltyDiscountService, LoyaltyOrder } from './production';

// REFACTOR: cover every branch and the error path (and run `npm run coverage` to prove it).
// Each rule gets a named case, so a regression points straight at the broken rule.
describe('LoyaltyDiscountService (refactored)', () => {
  let service: LoyaltyDiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(LoyaltyDiscountService);
  });

  it.each<[string, LoyaltyOrder, number]>([
    ['employees get 30%', { total: 200, loyaltyYears: 0, isEmployee: true }, 60],
    ['5+ loyal years get 10%', { total: 200, loyaltyYears: 6, isEmployee: false }, 20],
    ['2+ loyal years and 100+ EUR get 5%', { total: 100, loyaltyYears: 2, isEmployee: false }, 5],
    ['2+ loyal years below 100 EUR get nothing', { total: 99.99, loyaltyYears: 3, isEmployee: false }, 0],
    ['new customers get nothing', { total: 500, loyaltyYears: 0, isEmployee: false }, 0],
    ['amounts are rounded to cents', { total: 33.33, loyaltyYears: 5, isEmployee: false }, 3.33],
  ])('%s', (_rule, order, expected) => {
    expect(service.discountFor(order)).toBe(expected);
  });

  it('rejects negative totals', () => {
    expect(() => service.discountFor({ total: -1, loyaltyYears: 0, isEmployee: false })).toThrowError(RangeError);
  });
});
