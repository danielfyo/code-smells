import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Booking {
  nights: number;
  nightlyRate: number;
  guests: number;
}

// SMELL: obsolete comment. The doc block says the tourist tax is 1 EUR per night and long stays
// get 5% off. The code charges 2.50 EUR per guest per night and 10% off from 7 nights. It lies.
/**
 * Shows the booking price. Adds a 1 EUR tourist tax per night.
 * Bookings longer than 7 nights get a 5% discount.
 * Displays the price with no decimals.
 */
@Component({
  selector: 'cs-obsolete-comment-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="price">{{ price().toFixed(2) }} EUR</p>`,
})
export class SmellyBookingPriceComponent {
  readonly booking = input.required<Booking>();

  readonly price = computed(() => {
    const { nights, nightlyRate, guests } = this.booking();
    const base = nights * nightlyRate;
    // SMELL: "more than 7 nights, 5%" -> it is actually 7 nights inclusive and 10%.
    const discount = nights >= 7 ? base * 0.1 : 0;
    // SMELL: "tax per night" -> it is actually per guest per night.
    const touristTax = nights * guests * 2.5;
    return base - discount + touristTax;
  });
}
