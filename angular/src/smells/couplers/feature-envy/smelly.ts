import { Component, Input } from '@angular/core';

export interface ParcelData {
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  fragile: boolean;
}

// SMELL: Feature Envy. `shippingCost()` lives in the component but talks only to the parcel:
// six reads of parcel fields and not a single use of the component's own state except the rate.
@Component({
  selector: 'cs-feature-envy-smelly',
  template: `<p>Shipping: {{ shippingCost().toFixed(2) }} €</p>`,
})
export class ShippingQuoteSmelly {
  @Input({ required: true }) parcel!: ParcelData;
  @Input() ratePerKg = 2;

  shippingCost(): number {
    const volumetric = (this.parcel.lengthCm * this.parcel.widthCm * this.parcel.heightCm) / 5000;
    const billable = Math.max(this.parcel.weightKg, volumetric);
    const handling = this.parcel.fragile ? 3 : 0;
    return billable * this.ratePerKg + handling;
  }
}
