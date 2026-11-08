import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Shipment, SmellyShippingCostService } from './smelly';
import { ShippingCostService } from './refactored';

describe('poorly-written-comment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each<{ shipment: Shipment; expected: number }>([
    { shipment: { weightKg: 0, express: false, country: 'ES' }, expected: 5 },
    { shipment: { weightKg: 10, express: false, country: 'ES' }, expected: 17 },
    { shipment: { weightKg: 10, express: true, country: 'ES' }, expected: 25.5 },
    { shipment: { weightKg: 10, express: true, country: 'FR' }, expected: 35.5 },
  ])('both versions charge $expected', ({ shipment, expected }) => {
    expect(TestBed.inject(SmellyShippingCostService).cost(shipment)).toBe(expected);
    expect(TestBed.inject(ShippingCostService).cost(shipment)).toBe(expected);
  });
});
