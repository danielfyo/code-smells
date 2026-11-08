import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShippingFeeService } from './production';

// SMELL: untested boundary conditions. Only comfortable values far from every threshold are
// checked. An off-by-one (`>` instead of `>=` at 50 EUR, `>=` instead of `>` at 10 kg or 30 kg)
// would pass this suite unnoticed.
describe('ShippingFeeService (smelly)', () => {
  it('charges small orders', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    expect(TestBed.inject(ShippingFeeService).fee(20, 2)).toBe(4.95);
  });

  it('ships big orders for free', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    expect(TestBed.inject(ShippingFeeService).fee(120, 5)).toBe(0);
  });
});
