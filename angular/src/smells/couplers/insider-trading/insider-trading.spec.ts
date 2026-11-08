import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OrderDeskSmelly, WarehouseSmelly } from './smelly';
import { OrderDesk, Warehouse } from './refactored';

describe('Insider Trading', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions reserve and ship in the same way', () => {
    const smellyDesk = TestBed.inject(OrderDeskSmelly);
    const smellyWarehouse = TestBed.inject(WarehouseSmelly);
    const desk = TestBed.inject(OrderDesk);
    const warehouse = TestBed.inject(Warehouse);

    const smelly = [smellyDesk.reserve('DESK'), smellyDesk.reserve('DESK'), smellyWarehouse.available('LAMP')];
    const refactored = [desk.reserve('DESK'), desk.reserve('DESK'), warehouse.available('LAMP')];
    expect(refactored).toEqual(smelly);
    expect(refactored).toEqual([true, false, 3]);

    smellyDesk.ship('DESK');
    desk.ship('DESK');
    expect(warehouse.available('DESK')).toBe(smellyWarehouse.available('DESK'));
  });

  it("the smelly warehouse's answer depends on another service's private array", () => {
    const desk = TestBed.inject(OrderDeskSmelly);
    const warehouse = TestBed.inject(WarehouseSmelly);
    desk.reserve('LAMP');
    expect(warehouse.available('LAMP')).toBe(2);
    desk.pendingReservations.length = 0; // an unrelated change inside the desk...
    expect(warehouse.available('LAMP')).toBe(3); // ...silently changes the warehouse's stock answer
  });
});
