// Production code: shipping cost calculation with several rules and errors.
export type Zone = "peninsula" | "islands" | "international";

const BASE_COST: Record<Zone, number> = { peninsula: 4, islands: 9, international: 20 };
const FREE_SHIPPING_FROM = 60;
const EXTRA_PER_KG_OVER_5 = 1.5;

export function shippingCost(weightKg: number, zone: Zone, orderTotal: number): number {
  if (weightKg <= 0) throw new RangeError("Weight must be positive");
  if (zone === "peninsula" && orderTotal >= FREE_SHIPPING_FROM) return 0;
  const overweight = Math.max(0, weightKg - 5);
  return BASE_COST[zone] + overweight * EXTRA_PER_KG_OVER_5;
}
