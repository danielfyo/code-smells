export interface Shipment {
  weightKg: number;
  distanceKm: number;
  express: boolean;
}

export interface Quote {
  total: number;
  breakdown: string[];
}

// REFACTOR: Replace Temporary Field with local variables / parameters.
// Intermediate values are passed explicitly and the class no longer has
// "half-filled" state: it can be shared and called concurrently without surprises.
export const baseCost = (s: Shipment): number => 3 + s.weightKg * 0.8 + s.distanceKm * 0.05;

export const expressSurcharge = (s: Shipment, base: number): number => (s.express ? base * 0.5 : 0);

export class ShippingQuoter {
  quote(shipment: Shipment): Quote {
    const base = baseCost(shipment);
    const surcharge = expressSurcharge(shipment, base);
    const breakdown = [`base:${base.toFixed(2)}`];
    if (surcharge > 0) breakdown.push(`express:${surcharge.toFixed(2)}`);
    return { total: Math.round((base + surcharge) * 100) / 100, breakdown };
  }
}
