import { Component, Injectable, Input, inject } from '@angular/core';

// SMELL: Alternative Classes with Different Interfaces. Both services price a parcel, but one
// wants kilograms and a zone and returns euros, the other wants grams and a country and returns
// cents. They cannot be swapped, so every client branches on which one it has.
@Injectable({ providedIn: 'root' })
export class PostalServiceSmelly {
  priceFor(weightKg: number, zone: 'domestic' | 'international'): number {
    return (zone === 'domestic' ? 3.5 : 9) + weightKg * 1.2;
  }
}

@Injectable({ providedIn: 'root' })
export class CourierApiSmelly {
  quote(request: { grams: number; destinationCountry: string }): { totalCents: number } {
    const base = request.destinationCountry === 'ES' ? 590 : 1490;
    return { totalCents: base + Math.ceil(request.grams / 500) * 100 };
  }
}

@Component({
  selector: 'cs-alternative-classes-smelly',
  template: `
    <p>Postal: {{ postalPrice().toFixed(2) }} €</p>
    <p>Courier: {{ courierPrice().toFixed(2) }} €</p>
  `,
})
export class ShippingQuotesSmelly {
  @Input() grams = 0;
  @Input() country = 'ES';

  private readonly postal = inject(PostalServiceSmelly);
  private readonly courier = inject(CourierApiSmelly);

  // SMELL: each client must translate units and results for each provider by hand.
  postalPrice(): number {
    return this.postal.priceFor(this.grams / 1000, this.country === 'ES' ? 'domestic' : 'international');
  }

  courierPrice(): number {
    return this.courier.quote({ grams: this.grams, destinationCountry: this.country }).totalCents / 100;
  }
}
