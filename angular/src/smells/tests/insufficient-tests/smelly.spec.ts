import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LoyaltyDiscountService } from './production';

// SMELL: insufficient tests. A single happy-path case. The employee rule, the two loyalty tiers,
// the "no discount" fallback and the negative-total error are never exercised, and no coverage
// report would point that out because nobody runs one.
describe('LoyaltyDiscountService (smelly)', () => {
  it('gives a discount', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const service = TestBed.inject(LoyaltyDiscountService);
    expect(service.discountFor({ total: 200, loyaltyYears: 6, isEmployee: false })).toBe(20);
  });
});
