import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const VOLUMETRIC_DIVISOR = 5000;
const FRAGILE_HANDLING_EUR = 3;

// REFACTOR: Move Method. The knowledge about weights and handling moves to the Parcel, the
// object that owns the data. The component just asks.
export class Parcel {
  constructor(
    readonly weightKg: number,
    readonly lengthCm: number,
    readonly widthCm: number,
    readonly heightCm: number,
    readonly fragile: boolean,
  ) {}

  billableWeightKg(): number {
    const volumetric = (this.lengthCm * this.widthCm * this.heightCm) / VOLUMETRIC_DIVISOR;
    return Math.max(this.weightKg, volumetric);
  }

  shippingCost(ratePerKg: number): number {
    return this.billableWeightKg() * ratePerKg + (this.fragile ? FRAGILE_HANDLING_EUR : 0);
  }
}

@Component({
  selector: 'cs-feature-envy-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Shipping: {{ cost().toFixed(2) }} €</p>`,
})
export class ShippingQuoteRefactored {
  readonly parcel = input.required<Parcel>();
  readonly ratePerKg = input(2);
  protected readonly cost = computed(() => this.parcel().shippingCost(this.ratePerKg()));
}
