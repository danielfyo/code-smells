import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// REFACTOR: Replace Temporary Fields with a value. The calculation returns an immutable
// RoutePlan, so there is no half-initialized state on the component.
export interface RoutePlan {
  readonly legs: number;
  readonly totalKm: number;
  readonly averageKm: number;
  readonly longestKm: number;
}

export function planRoute(stopDistancesKm: readonly number[]): RoutePlan {
  const legs = stopDistancesKm.filter((km) => km > 0);
  const totalKm = legs.reduce((sum, km) => sum + km, 0);
  return {
    legs: legs.length,
    totalKm,
    averageKm: legs.length === 0 ? 0 : totalKm / legs.length,
    longestKm: Math.max(0, ...legs),
  };
}

@Component({
  selector: 'cs-temporary-field-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let route = plan();
    <p>
      {{ route.legs }} legs, {{ route.totalKm.toFixed(1) }} km, average {{ route.averageKm.toFixed(1) }} km, longest
      {{ route.longestKm }} km
    </p>
  `,
})
export class DeliveryRouteRefactored {
  readonly stopDistancesKm = input<readonly number[]>([]);
  // REFACTOR: derived state is a computed signal, always consistent with its input.
  protected readonly plan = computed(() => planRoute(this.stopDistancesKm()));
}
