import { InventoryService } from './production';

// SMELL: interdependent tests / shared fixture. One instance is shared by the whole suite and
// each test relies on what the previous one left behind. Run "ships units" alone (it.only, a
// filter, a shuffled order) and it fails: there is no stock to ship.
const inventory = new InventoryService();

describe('InventoryService (smelly)', () => {
  it('receives units', () => {
    inventory.receive('KEYBOARD', 10);
    expect(inventory.unitsOf('KEYBOARD')).toBe(10);
  });

  it('ships units', () => {
    inventory.ship('KEYBOARD', 4); // depends on the previous test
    expect(inventory.unitsOf('KEYBOARD')).toBe(6);
  });

  it('refuses to ship more than available', () => {
    expect(() => inventory.ship('KEYBOARD', 7)).toThrowError('Only 6 units of KEYBOARD left');
  });
});
