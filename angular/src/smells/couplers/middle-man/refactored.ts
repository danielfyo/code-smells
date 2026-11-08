import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WeatherStore } from './store';

// REFACTOR: Remove Middle Man. The component talks to the store directly; the forwarding facade
// is deleted. (Keep a facade only when it adds real value: combining stores, adapting an API.)
@Component({
  selector: 'cs-middle-man-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>{{ store.forecast().length }} days</p>
    <p>Warmest: {{ store.warmest()?.day ?? 'n/a' }}</p>
  `,
})
export class ForecastPanelRefactored {
  protected readonly store = inject(WeatherStore);
}
