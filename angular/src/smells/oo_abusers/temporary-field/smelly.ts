import { Component, Input } from '@angular/core';

// SMELL: Temporary Field. `legs`, `totalKm` and `longestLeg` only hold meaningful values while
// `summary()` runs. Outside of it they are stale or undefined, yet any method can read them.
@Component({
  selector: 'cs-temporary-field-smelly',
  template: `<p>{{ summary() }}</p>`,
})
export class DeliveryRouteSmelly {
  @Input() stopDistancesKm: number[] = [];

  private legs?: number[];
  private totalKm?: number;
  private longestLeg?: number;

  summary(): string {
    this.legs = this.stopDistancesKm.filter((km) => km > 0);
    this.totalKm = this.legs.reduce((sum, km) => sum + km, 0);
    this.longestLeg = Math.max(0, ...this.legs);
    return `${this.legs.length} legs, ${this.totalKm.toFixed(1)} km, average ${this.averageLeg().toFixed(1)} km, longest ${this.longestLeg} km`;
  }

  // SMELL: only valid if `summary()` ran first; otherwise it computes NaN.
  averageLeg(): number {
    return (this.totalKm as number) / (this.legs?.length ?? 0);
  }
}
