import { Injectable, computed, signal } from '@angular/core';

export interface Reservation {
  readonly guest: string;
  readonly seats: number;
}

const CAPACITY = 20;

// REFACTOR: Encapsulate Collection / Hide Method. The state is a private signal; callers get a
// read-only view and derived values that cannot drift. The only way to change state is `book()`,
// which enforces the capacity invariant.
@Injectable({ providedIn: 'root' })
export class TableBookingService {
  private readonly bookings = signal<readonly Reservation[]>([]);

  readonly reservations = this.bookings.asReadonly();
  readonly seatsTaken = computed(() => this.bookings().reduce((sum, r) => sum + r.seats, 0));
  readonly seatsLeft = computed(() => CAPACITY - this.seatsTaken());

  book(guest: string, seats: number): boolean {
    if (seats > this.seatsLeft()) return false;
    this.bookings.update((current) => [...current, { guest, seats }]);
    return true;
  }
}
