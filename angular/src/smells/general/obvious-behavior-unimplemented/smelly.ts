import { Injectable } from '@angular/core';

export interface StayRange {
  checkIn: Date;
  checkOut: Date;
}

@Injectable({ providedIn: 'root' })
export class SmellyStayCalendarService {
  // SMELL: obvious behavior unimplemented. Anyone expects a date parser to reject "2026-02-30";
  // this one lets Date silently roll it over into March.
  parseDay(iso: string): Date {
    return new Date(`${iso}T00:00:00Z`);
  }

  // SMELL: "includes" a range... except its last day, which nobody would guess.
  includes(range: StayRange, day: Date): boolean {
    return day >= range.checkIn && day < range.checkOut;
  }

  // SMELL: a "price" formatter that neither rounds to cents nor pads decimals.
  formatPrice(amount: number): string {
    return `${amount} EUR`;
  }
}
