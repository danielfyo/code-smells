import { Component, Input } from '@angular/core';

// SMELL: Inappropriate Static. The current time is read through a static method, a hidden
// global dependency: the component cannot be given another clock, and tests must patch the
// class itself (affecting every other user of it).
export class SystemClockSmelly {
  static now(): Date {
    return new Date();
  }
}

export class TicketPricingSmelly {
  static priceFor(baseCents: number): number {
    const day = SystemClockSmelly.now().getDay();
    const weekend = day === 0 || day === 6;
    return weekend ? Math.round(baseCents * 1.2) : baseCents;
  }
}

@Component({
  selector: 'cs-inappropriate-static-smelly',
  template: `<p>Ticket: {{ price().toFixed(2) }} €</p>`,
})
export class MuseumTicketSmelly {
  @Input() baseCents = 0;

  price(): number {
    return TicketPricingSmelly.priceFor(this.baseCents) / 100;
  }
}
