import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyCouponService } from './smelly';
import { Coupon, CouponService } from './refactored';

describe('ambiguous-name', () => {
  const coupons: Coupon[] = [
    { code: 'SPRING', expiresOn: '2026-03-31' },
    { code: 'SUMMER', expiresOn: '2026-08-31' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions keep the coupons that are still valid', () => {
    expect(TestBed.inject(SmellyCouponService).filter(coupons, '2026-03-31').map((c) => c.code)).toEqual(['SPRING', 'SUMMER']);
    expect(TestBed.inject(CouponService).stillValidOn(coupons, '2026-04-01').map((c) => c.code)).toEqual(['SUMMER']);
    expect(TestBed.inject(SmellyCouponService).filter(coupons, '2026-04-01').map((c) => c.code)).toEqual(['SUMMER']);
  });

  it('both versions tell whether a code can be redeemed', () => {
    expect(TestBed.inject(SmellyCouponService).check(coupons, 'SPRING', '2026-04-01')).toBe(false);
    expect(TestBed.inject(CouponService).isRedeemableOn(coupons, 'SPRING', '2026-04-01')).toBe(false);
    expect(TestBed.inject(SmellyCouponService).check(coupons, 'SUMMER', '2026-04-01')).toBe(true);
    expect(TestBed.inject(CouponService).isRedeemableOn(coupons, 'SUMMER', '2026-04-01')).toBe(true);
  });
});
