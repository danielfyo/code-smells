import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyStayCalendarService } from './smelly';
import { StayCalendarService } from './refactored';

describe('obvious-behavior-unimplemented', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('smelly: surprises callers (rolls dates over, excludes the last day, does not round)', () => {
    const smelly = TestBed.inject(SmellyStayCalendarService);
    expect(smelly.parseDay('2026-02-30').toISOString()).toBe('2026-03-02T00:00:00.000Z');
    const range = { checkIn: smelly.parseDay('2026-07-01'), checkOut: smelly.parseDay('2026-07-05') };
    expect(smelly.includes(range, smelly.parseDay('2026-07-05'))).toBe(false);
    expect(smelly.formatPrice(10.1)).toBe('10.1 EUR');
    expect(smelly.formatPrice(2.005)).toBe('2.005 EUR');
  });

  it('refactored: behaves as anyone would expect', () => {
    const calendar = TestBed.inject(StayCalendarService);
    expect(() => calendar.parseDay('2026-02-30')).toThrowError(RangeError);
    const range = { checkIn: calendar.parseDay('2026-07-01'), checkOut: calendar.parseDay('2026-07-05') };
    expect(calendar.includes(range, calendar.parseDay('2026-07-05'))).toBe(true);
    expect(calendar.includes(range, calendar.parseDay('2026-07-06'))).toBe(false);
    expect(calendar.formatPrice(10.1)).toBe('10.10 EUR');
    expect(calendar.formatPrice(-3)).toBe('-3.00 EUR');
  });

  it('both versions agree on ordinary inputs', () => {
    const smelly = TestBed.inject(SmellyStayCalendarService);
    const calendar = TestBed.inject(StayCalendarService);
    expect(smelly.parseDay('2026-07-01')).toEqual(calendar.parseDay('2026-07-01'));
    const range = { checkIn: calendar.parseDay('2026-07-01'), checkOut: calendar.parseDay('2026-07-05') };
    expect(smelly.includes(range, calendar.parseDay('2026-07-03'))).toBe(calendar.includes(range, calendar.parseDay('2026-07-03')));
  });
});
