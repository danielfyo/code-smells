export interface Shipment {
  weightKg: number;
  distanceKm: number;
  express: boolean;
}

// SMELL: Temporary Field. `baseCost`, `surcharge` and `breakdown` only make
// sense while `quote()` is running. The rest of the time they are empty or hold
// leftovers from the previous call, and anyone reading them elsewhere gets confused.
export class ShippingQuoter {
  baseCost = 0;
  surcharge = 0;
  breakdown: string[] = [];

  quote(shipment: Shipment): { total: number; breakdown: string[] } {
    // SMELL: we must remember to "reset" the fields on every call.
    this.breakdown = [];
    this.computeBase(shipment);
    this.computeSurcharge(shipment);
    const total = Math.round((this.baseCost + this.surcharge) * 100) / 100;
    return { total, breakdown: this.breakdown };
  }

  private computeBase(s: Shipment): void {
    this.baseCost = 3 + s.weightKg * 0.8 + s.distanceKm * 0.05;
    this.breakdown.push(`base:${this.baseCost.toFixed(2)}`);
  }

  private computeSurcharge(s: Shipment): void {
    // SMELL: depends on `baseCost` having been computed first (implicit ordering).
    this.surcharge = s.express ? this.baseCost * 0.5 : 0;
    if (this.surcharge > 0) this.breakdown.push(`express:${this.surcharge.toFixed(2)}`);
  }
}
