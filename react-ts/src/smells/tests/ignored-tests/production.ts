// Production code: applying discount coupons.
export interface Coupon {
  code: string;
  percent: number;
  minOrder: number;
}

export function applyCoupon(total: number, coupon: Coupon): number {
  if (total < coupon.minOrder) return total;
  const discounted = total * (1 - coupon.percent / 100);
  return Math.round(discounted * 100) / 100;
}
