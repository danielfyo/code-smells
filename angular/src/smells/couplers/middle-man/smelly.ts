import { Component, Injectable, inject } from '@angular/core';
import { WeatherStore, type DayForecast } from './store';

// SMELL: Middle Man. Every method of the facade just forwards to WeatherStore. It adds a class,
// a provider and an indirection, and every new store feature needs a new forwarding method.
@Injectable({ providedIn: 'root' })
export class WeatherFacadeSmelly {
  private readonly store = inject(WeatherStore);

  getForecast(): readonly DayForecast[] {
    return this.store.forecast();
  }

  getWarmest(): DayForecast | undefined {
    return this.store.warmest();
  }

  load(days: readonly DayForecast[]): void {
    this.store.load(days);
  }
}

@Component({
  selector: 'cs-middle-man-smelly',
  template: `
    <p>{{ facade.getForecast().length }} days</p>
    <p>Warmest: {{ facade.getWarmest()?.day ?? 'n/a' }}</p>
  `,
})
export class ForecastPanelSmelly {
  readonly facade = inject(WeatherFacadeSmelly);
}
