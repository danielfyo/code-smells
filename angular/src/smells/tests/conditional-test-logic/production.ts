import { Injectable } from '@angular/core';

// Production code: applies a coupon code to an order total.
@Injectable({ providedIn: 'root' })
export class CouponCalculator {
  apply(total: number, code: string): number {
    if (code === 'WELCOME10') return Math.round(total * 90) / 100;
    if (code === 'FLAT5') return Math.max(0, total - 5);
    if (code === '') return total;
    throw new Error(`Unknown coupon ${code}`);
  }
}
