import { Injectable } from '@angular/core';

export interface Coupon {
  code: string;
  expiresOn: string; // ISO date, valid until the end of that day
}

// REFACTOR: Rename Method / Rename Parameter. Each name answers the question the old one raised:
// what is kept, what the date means and what the boolean says.
@Injectable({ providedIn: 'root' })
export class CouponService {
  stillValidOn(coupons: readonly Coupon[], today: string): Coupon[] {
    return coupons.filter((coupon) => coupon.expiresOn >= today);
  }

  isRedeemableOn(coupons: readonly Coupon[], code: string, today: string): boolean {
    return this.stillValidOn(coupons, today).some((coupon) => coupon.code === code);
  }
}
