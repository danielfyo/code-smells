export interface Shipment {
  weightKg: number;
  zone: "local" | "national" | "international";
  express: boolean;
}

const BASE_RATE_BY_ZONE: Record<Shipment["zone"], number> = { local: 3, national: 6, international: 15 };
const HEAVY_THRESHOLD_KG = 10;
const EXTRA_PER_KG = 0.5;
const EXPRESS_MULTIPLIER = 1.5;

// REFACTOR: name length grows with scope. Variables that live across the function get
// descriptive names; those with a tiny scope (lambdas) may stay short.
function shipmentCost(shipment: Shipment): number {
  const overweightKg = Math.max(0, shipment.weightKg - HEAVY_THRESHOLD_KG);
  const cost = BASE_RATE_BY_ZONE[shipment.zone] + overweightKg * EXTRA_PER_KG;
  return shipment.express ? cost * EXPRESS_MULTIPLIER : cost;
}

export function shippingReport(shipments: Shipment[]): { total: number; heavy: number; express: number } {
  const totalCost = shipments.reduce((sum, shipment) => sum + shipmentCost(shipment), 0);
  const heavyCount = shipments.filter((s) => s.weightKg > HEAVY_THRESHOLD_KG).length;
  const expressCount = shipments.filter((s) => s.express).length;
  return { total: Math.round(totalCost * 100) / 100, heavy: heavyCount, express: expressCount };
}
