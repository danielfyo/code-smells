import { Component, Injectable, Input, inject } from '@angular/core';

// SMELL: Lazy Class. A wrapper class around a single number and a service with a single
// one-line method. Each one adds a file to open, a type to learn and a provider to configure,
// but neither carries any real behavior.
export class CelsiusReadingSmelly {
  constructor(private readonly value: number) {}

  getValue(): number {
    return this.value;
  }
}

@Injectable({ providedIn: 'root' })
export class TemperatureFormatterSmelly {
  format(reading: CelsiusReadingSmelly): string {
    return `${reading.getValue().toFixed(1)} °C`;
  }
}

@Component({
  selector: 'cs-lazy-class-smelly',
  template: `<p>{{ city }}: {{ formatted() }}</p>`,
})
export class WeatherBadgeSmelly {
  @Input() city = '';
  @Input() celsius = 0;

  private readonly formatter = inject(TemperatureFormatterSmelly);

  formatted(): string {
    return this.formatter.format(new CelsiusReadingSmelly(this.celsius));
  }
}
