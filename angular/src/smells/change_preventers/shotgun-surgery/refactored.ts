import { ChangeDetectionStrategy, Component, Pipe, type PipeTransform, input } from '@angular/core';
import type { CarRental, FlightBooking, HotelBooking } from './model';

// REFACTOR: Move Function / Combine Functions into a Pipe. The VAT rate and the currency format
// live in exactly one place; every row reuses them.
export const VAT_RATE = 0.21;

export function grossPrice(netCents: number): string {
  return `${(Math.round(netCents * (1 + VAT_RATE)) / 100).toFixed(2)} €`;
}

@Pipe({ name: 'grossPrice' })
export class GrossPricePipe implements PipeTransform {
  transform(netCents: number): string {
    return grossPrice(netCents);
  }
}

@Component({
  selector: 'cs-shotgun-flight-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GrossPricePipe],
  template: `<p>{{ booking().route }}: {{ booking().netCents | grossPrice }}</p>`,
})
export class FlightRowRefactored {
  readonly booking = input.required<FlightBooking>();
}

@Component({
  selector: 'cs-shotgun-hotel-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GrossPricePipe],
  template: `<p>{{ booking().hotel }} ({{ booking().nights }} nights): {{ booking().nights * booking().nightlyNetCents | grossPrice }}</p>`,
})
export class HotelRowRefactored {
  readonly booking = input.required<HotelBooking>();
}

@Component({
  selector: 'cs-shotgun-car-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GrossPricePipe],
  template: `<p>{{ data().model }} ({{ data().days }} days): {{ data().days * data().dailyNetCents | grossPrice }}</p>`,
})
export class CarRowRefactored {
  readonly data = input.required<CarRental>();
}
