import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyTableBookingService } from './smelly';
import { TableBookingService } from './refactored';

describe('too-much-information', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions accept bookings until capacity is reached', () => {
    const smelly = TestBed.inject(SmellyTableBookingService);
    const refactored = TestBed.inject(TableBookingService);
    expect([smelly.book('Ana', 12), smelly.book('Leo', 8), smelly.book('Eva', 1)]).toEqual([true, true, false]);
    expect([refactored.book('Ana', 12), refactored.book('Leo', 8), refactored.book('Eva', 1)]).toEqual([true, true, false]);
    expect(smelly.seatsTaken).toBe(20);
    expect(refactored.seatsTaken()).toBe(20);
  });

  it('smelly: outsiders can break the invariants through the exposed state', () => {
    const smelly = TestBed.inject(SmellyTableBookingService);
    smelly.reservations.push({ guest: 'Party', seats: 50 });
    expect(smelly.seatsTaken).toBe(0); // stale derived value
    expect(smelly.book('Ana', 4)).toBe(true); // overbooked: 54 seats for a 20-seat room
  });

  it('refactored: the read-only view offers no way to mutate the bookings', () => {
    const refactored = TestBed.inject(TableBookingService);
    refactored.book('Ana', 4);
    expect('set' in refactored.reservations).toBe(false);
    expect(refactored.seatsLeft()).toBe(16);
  });
});
