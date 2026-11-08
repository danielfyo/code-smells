import { Injectable } from '@angular/core';

export interface StayRange {
  checkIn: Date;
  checkOut: Date;
}

@Injectable({ providedIn: 'root' })
export class StayCalendarService {
  // REFACTOR: implement the obvious behavior. Impossible dates are rejected instead of rolled over.
  parseDay(iso: string): Date {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) {
      throw new RangeError(`Invalid day: ${iso}`);
    }
    return date;
  }

  // REFACTOR: an inclusive range, as the name says; both ends belong to the stay.
  includes(range: StayRange, day: Date): boolean {
    return day >= range.checkIn && day <= range.checkOut;
  }

  // REFACTOR: a price always shows exactly two decimals, rounded half away from zero.
  formatPrice(amount: number): string {
    const cents = Math.sign(amount) * Math.round(Math.abs(amount) * 100);
    return `${(cents / 100).toFixed(2)} EUR`;
  }
}
