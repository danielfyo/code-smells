import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShippingFeeService } from './production';

// REFACTOR: test each boundary and its immediate neighbours (just below, on, just above).
describe('ShippingFeeService (refactored)', () => {
  let service: ShippingFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(ShippingFeeService);
  });

  it.each([
    [49.99, 4.95],
    [50, 0],
    [50.01, 0],
  ])('free-shipping threshold: total %s EUR costs %s EUR', (total, expected) => {
    expect(service.fee(total, 1)).toBe(expected);
  });

  it.each([
    [10, 4.95],
    [10.01, 9.95],
    [30, 9.95],
  ])('weight band: %s kg costs %s EUR', (weight, expected) => {
    expect(service.fee(10, weight)).toBe(expected);
  });

  it.each([0, -1, 30.01])('rejects unsupported weight %s kg', (weight) => {
    expect(() => service.fee(10, weight)).toThrowError(RangeError);
  });
});
