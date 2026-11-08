import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { smellyBookingCodeValidator } from './smelly';
import { bookingCodeValidator } from './refactored';

describe('complicated-regex', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each([
    ['MAD-20260315-0042', true],
    ['MAD-20260315-0042-VIP', true],
    ['BCN-20261231-9999-STD', true],
    ['mad-20260315-0042', false],
    ['MAD-20261315-0042', false],
    ['MAD-20260332-0042', false],
    ['MAD-20260315-42', false],
    ['MAD-20260315-0042-ECO', false],
  ])('%s is valid: %s in both versions', (code, valid) => {
    const smelly = new FormControl(code, { nonNullable: true, validators: smellyBookingCodeValidator });
    const refactored = new FormControl(code, { nonNullable: true, validators: bookingCodeValidator });
    expect(smelly.valid).toBe(valid);
    expect(refactored.valid).toBe(valid);
    expect(refactored.errors).toEqual(valid ? null : { bookingCode: true });
  });
});
