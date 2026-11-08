import { Injectable, computed, signal } from '@angular/core';

export interface DayForecast {
  day: string;
  maxC: number;
}

// The real store with the actual state and behavior; both versions use it.
@Injectable({ providedIn: 'root' })
export class WeatherStore {
  private readonly days = signal<readonly DayForecast[]>([]);
  readonly forecast = this.days.asReadonly();
  readonly warmest = computed(() =>
    this.days().reduce<DayForecast | undefined>((best, d) => (!best || d.maxC > best.maxC ? d : best), undefined),
  );

  load(days: readonly DayForecast[]): void {
    this.days.set(days);
  }
}
