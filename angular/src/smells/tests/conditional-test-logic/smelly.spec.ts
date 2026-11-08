import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CouponCalculator } from './production';

// SMELL: conditional test logic. Loops, ifs and try/catch decide which assertions run. If
// `apply` stops throwing, the catch block never executes and the test still passes; if the list
// is filtered by mistake, the loop asserts nothing. The test can be green while testing nothing.
describe('CouponCalculator (smelly)', () => {
  it('applies coupons', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const calculator = TestBed.inject(CouponCalculator);
    for (const code of ['WELCOME10', 'FLAT5', '', 'BOGUS']) {
      if (code === 'WELCOME10') {
        expect(calculator.apply(100, code)).toBe(90);
      } else if (code === 'FLAT5') {
        expect(calculator.apply(3, code)).toBe(0);
      } else if (code) {
        try {
          calculator.apply(100, code);
        } catch (error) {
          expect((error as Error).message).toContain('Unknown');
        }
      }
    }
  });
});
