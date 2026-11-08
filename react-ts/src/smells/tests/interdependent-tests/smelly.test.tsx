import { Inventory } from "./production";

// SMELL: interdependent tests. They share a mutable instance created once and each test
// depends on what the previous one left behind. Running one in isolation (it.only),
// changing the order or parallelizing breaks them.
const inventory = new Inventory();

describe("Inventory (smelly)", () => {
  it("receives goods", () => {
    inventory.receive("chair", 10);
    expect(inventory.unitsOf("chair")).toBe(10);
  });

  it("ships goods", () => {
    // SMELL: only works if the previous test already received 10 chairs.
    inventory.ship("chair", 4);
    expect(inventory.unitsOf("chair")).toBe(6);
  });

  it("rejects shipments without enough stock", () => {
    // SMELL: depends on exactly 6 being left.
    expect(() => inventory.ship("chair", 7)).toThrow("Insufficient stock");
  });
});
