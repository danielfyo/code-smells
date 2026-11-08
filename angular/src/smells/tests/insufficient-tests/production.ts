import { Injectable } from '@angular/core';

// Production code: loyalty discount for an order. Several branches and an error path.
export interface LoyaltyOrder {
  total: number;
  loyaltyYears: number;
  isEmployee: boolean;
}

@Injectable({ providedIn: 'root' })
export class LoyaltyDiscountService {
  discountFor(order: LoyaltyOrder): number {
    if (order.total < 0) throw new RangeError('Order total cannot be negative');
    if (order.isEmployee) return round(order.total * 0.3);
    if (order.loyaltyYears >= 5) return round(order.total * 0.1);
    if (order.loyaltyYears >= 2 && order.total >= 100) return round(order.total * 0.05);
    return 0;
  }
}

function round(amount: number): number {
  return Math.round(amount * 100) / 100;
}
