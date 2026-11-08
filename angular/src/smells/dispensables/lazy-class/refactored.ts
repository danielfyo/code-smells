import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// REFACTOR: Inline Class / Collapse Hierarchy. The wrapper and the one-method service are
// replaced by a plain number and a tiny pure function. If formatting ever grows real rules,
// it can be promoted to a pipe then, not before.
export function formatCelsius(celsius: number): string {
  return `${celsius.toFixed(1)} °C`;
}

@Component({
  selector: 'cs-lazy-class-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ city() }}: {{ formatted() }}</p>`,
})
export class WeatherBadgeRefactored {
  readonly city = input('');
  readonly celsius = input(0);
  protected readonly formatted = computed(() => formatCelsius(this.celsius()));
}
