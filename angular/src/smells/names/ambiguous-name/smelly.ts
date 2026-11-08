import { Injectable } from '@angular/core';

export interface Coupon {
  code: string;
  expiresOn: string; // ISO date
}

@Injectable({ providedIn: 'root' })
export class SmellyCouponService {
  // SMELL: ambiguous name. Does `filter(coupons, date)` keep the expired coupons or remove them?
  // Is `date` the expiry limit or "today"? And `check` returns a boolean meaning... what exactly?
  // Callers must open the implementation to find out.
  filter(coupons: readonly Coupon[], date: string): Coupon[] {
    return coupons.filter((coupon) => coupon.expiresOn >= date);
  }

  check(coupons: readonly Coupon[], code: string, date: string): boolean {
    return this.filter(coupons, date).some((coupon) => coupon.code === code);
  }
}
