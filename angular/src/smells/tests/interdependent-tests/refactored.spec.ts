import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InventoryService } from './production';

// REFACTOR: fresh fixture per test. TestBed is reset before every test, so each one gets a new
// InventoryService and arranges exactly the stock it needs. Any order, any subset, same result.
describe('InventoryService (refactored)', () => {
  let inventory: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    inventory = TestBed.inject(InventoryService);
  });

  it('receives units', () => {
    inventory.receive('KEYBOARD', 10);
    expect(inventory.unitsOf('KEYBOARD')).toBe(10);
  });

  it('ships units', () => {
    inventory.receive('KEYBOARD', 10);
    inventory.ship('KEYBOARD', 4);
    expect(inventory.unitsOf('KEYBOARD')).toBe(6);
  });

  it('refuses to ship more than available', () => {
    inventory.receive('KEYBOARD', 6);
    expect(() => inventory.ship('KEYBOARD', 7)).toThrowError('Only 6 units of KEYBOARD left');
  });
});
