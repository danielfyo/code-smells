import { Inventory } from "./production";

// REFACTOR: each test creates its own state (fresh fixture in beforeEach) and explicitly
// sets up what it needs. They can run alone and in any order.
describe("Inventory (refactored)", () => {
  let inventory: Inventory;

  beforeEach(() => {
    inventory = new Inventory();
  });

  it("receives goods", () => {
    inventory.receive("chair", 10);
    expect(inventory.unitsOf("chair")).toBe(10);
  });

  it("ships goods", () => {
    inventory.receive("chair", 10);
    inventory.ship("chair", 4);
    expect(inventory.unitsOf("chair")).toBe(6);
  });

  it("rejects shipments without enough stock", () => {
    inventory.receive("chair", 6);
    expect(() => inventory.ship("chair", 7)).toThrow("Insufficient stock");
  });
});
