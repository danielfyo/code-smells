import type { StockLine } from './model';
import { InventorySmelly } from './smelly';
import { Inventory } from './refactored';

const lines: StockLine[] = [
  { sku: 'MUG-01', quantity: 6 },
  { sku: 'TEAPOT-02', quantity: 2 },
  { sku: 'TEAPOT-02', quantity: 1 },
];

describe('Exceptions for Control Flow', () => {
  it('both versions import the same lines with the same log', () => {
    const smelly = new InventorySmelly();
    const refactored = new Inventory();
    expect(refactored.importLines(lines)).toEqual(smelly.importLines(lines));
    expect(refactored.snapshot()).toEqual(smelly.snapshot());
    expect(refactored.snapshot()).toEqual([
      ['MUG-01', 10],
      ['TEAPOT-02', 3],
    ]);
  });

  it('an unknown SKU is a value, not an exception', () => {
    expect(() => new InventorySmelly().quantityOf('NOPE')).toThrow();
    expect(new Inventory().quantityOf('NOPE')).toBeUndefined();
  });
});
