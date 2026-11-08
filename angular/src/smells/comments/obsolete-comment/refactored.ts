import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Booking {
  nights: number;
  nightlyRate: number;
  guests: number;
}

// REFACTOR: Replace Magic Number with Named Constant. The facts the comment tried to describe now
// live in names the compiler sees, so they cannot drift away from the behavior.
export const TOURIST_TAX_PER_GUEST_NIGHT = 2.5;
export const LONG_STAY_MIN_NIGHTS = 7;
export const LONG_STAY_DISCOUNT = 0.1;

export function bookingPrice({ nights, nightlyRate, guests }: Booking): number {
  const base = nights * nightlyRate;
  const discount = nights >= LONG_STAY_MIN_NIGHTS ? base * LONG_STAY_DISCOUNT : 0;
  const touristTax = nights * guests * TOURIST_TAX_PER_GUEST_NIGHT;
  return base - discount + touristTax;
}

/** Shows the booking price with long-stay discount and tourist tax. */
@Component({
  selector: 'cs-obsolete-comment-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="price">{{ price().toFixed(2) }} EUR</p>`,
})
export class BookingPriceComponent {
  readonly booking = input.required<Booking>();
  readonly price = computed(() => bookingPrice(this.booking()));
}
