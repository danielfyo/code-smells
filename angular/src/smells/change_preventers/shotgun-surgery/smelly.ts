import { Component, Input } from '@angular/core';
import type { CarRental, FlightBooking, HotelBooking } from './model';

// SMELL: Shotgun Surgery. "Show prices with VAT and the euro sign" is one concept, yet the VAT
// rate and the formatting are repeated in three components. Changing the VAT rate or the
// currency layout means editing all three (and probably a fourth one nobody remembers).
@Component({
  selector: 'cs-shotgun-flight-smelly',
  template: `<p>{{ booking.route }}: {{ (booking.netCents * 1.21 / 100).toFixed(2) }} €</p>`,
})
export class FlightRowSmelly {
  @Input({ required: true }) booking!: FlightBooking;
}

@Component({
  selector: 'cs-shotgun-hotel-smelly',
  template: `<p>{{ booking.hotel }} ({{ booking.nights }} nights): {{ total() }}</p>`,
})
export class HotelRowSmelly {
  @Input({ required: true }) booking!: HotelBooking;

  total(): string {
    return ((this.booking.nights * this.booking.nightlyNetCents * 1.21) / 100).toFixed(2) + ' €';
  }
}

@Component({
  selector: 'cs-shotgun-car-smelly',
  template: `<p>{{ rental.model }} ({{ rental.days }} days): {{ total }} €</p>`,
})
export class CarRowSmelly {
  @Input({ required: true }) set data(rental: CarRental) {
    this.rental = rental;
    this.total = (Math.round(rental.days * rental.dailyNetCents * 1.21) / 100).toFixed(2);
  }
  rental: CarRental = { model: '', days: 0, dailyNetCents: 0 };
  total = '';
}
