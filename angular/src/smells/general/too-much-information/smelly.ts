import { Injectable } from '@angular/core';

export interface Reservation {
  guest: string;
  seats: number;
}

// SMELL: too much information / indecent exposure. The internal array, a cached derived
// counter and a housekeeping helper are all public. Any component can push to `reservations`
// or overwrite `seatsTaken`, and the invariant "seatsTaken never exceeds capacity" is gone.
@Injectable({ providedIn: 'root' })
export class SmellyTableBookingService {
  public capacity = 20;
  public reservations: Reservation[] = [];
  public seatsTaken = 0;

  public recalculateSeats(): void {
    this.seatsTaken = this.reservations.reduce((sum, r) => sum + r.seats, 0);
  }

  public hasRoomFor(seats: number): boolean {
    return this.seatsTaken + seats <= this.capacity;
  }

  public book(guest: string, seats: number): boolean {
    if (!this.hasRoomFor(seats)) return false;
    this.reservations.push({ guest, seats });
    this.recalculateSeats();
    return true;
  }
}
