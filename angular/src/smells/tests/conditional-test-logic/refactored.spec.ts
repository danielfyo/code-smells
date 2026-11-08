import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CouponCalculator } from './production';

// REFACTOR: straight-line tests. Parameterized cases replace the loop and the ifs, and
// `toThrowError` replaces try/catch, so every assertion always runs.
describe('CouponCalculator (refactored)', () => {
  let calculator: CouponCalculator;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    calculator = TestBed.inject(CouponCalculator);
  });

  it.each([
    { code: 'WELCOME10', total: 100, expected: 90 },
    { code: 'FLAT5', total: 20, expected: 15 },
    { code: 'FLAT5', total: 3, expected: 0 },
    { code: '', total: 42, expected: 42 },
  ])('$code on $total gives $expected', ({ code, total, expected }) => {
    expect(calculator.apply(total, code)).toBe(expected);
  });

  it('rejects unknown coupons', () => {
    expect(() => calculator.apply(100, 'BOGUS')).toThrowError('Unknown coupon BOGUS');
  });
});
