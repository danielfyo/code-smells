import { Injectable } from '@angular/core';

// Production code: shipping fee by order total and parcel weight.
export const FREE_SHIPPING_FROM = 50;
export const MAX_WEIGHT_KG = 30;

@Injectable({ providedIn: 'root' })
export class ShippingFeeService {
  fee(orderTotal: number, weightKg: number): number {
    if (weightKg <= 0 || weightKg > MAX_WEIGHT_KG) throw new RangeError(`Unsupported weight: ${weightKg} kg`);
    if (orderTotal >= FREE_SHIPPING_FROM) return 0;
    return weightKg > 10 ? 9.95 : 4.95;
  }
}
