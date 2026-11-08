import { Injectable } from '@angular/core';

export interface Shipment {
  weightKg: number;
  express: boolean;
  country: string;
}

const BASE_FEE = 5;
const PER_KG = 1.2;
const EXPRESS_MULTIPLIER = 1.5;
const INTERNATIONAL_SURCHARGE = 10;
const HOME_COUNTRY = 'ES';

@Injectable({ providedIn: 'root' })
export class ShippingCostService {
  /**
   * REFACTOR: Rewrite the comment precisely and let names carry the rest.
   * Shipping cost = (base fee + weight rate), multiplied for express delivery, plus a flat
   * surcharge for destinations outside Spain. A 0 kg parcel (documents) pays only the base fee.
   * Rounded to cents.
   */
  cost(shipment: Shipment): number {
    const byWeight = BASE_FEE + shipment.weightKg * PER_KG;
    const withSpeed = shipment.express ? byWeight * EXPRESS_MULTIPLIER : byWeight;
    const international = shipment.country !== HOME_COUNTRY ? INTERNATIONAL_SURCHARGE : 0;
    return Math.round((withSpeed + international) * 100) / 100;
  }
}
