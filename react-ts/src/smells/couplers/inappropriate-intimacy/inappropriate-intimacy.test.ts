import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

describe("Inappropriate Intimacy", () => {
  it("both carts reserve stock the same way", () => {
    const smellyInventory = new Smelly.Inventory({ "SKU-1": 3 });
    const smellyCart = new Smelly.Cart(smellyInventory);
    const refactoredInventory = new Refactored.Inventory({ "SKU-1": 3 });
    const refactoredCart = new Refactored.Cart(refactoredInventory);

    const smelly = [smellyCart.add("SKU-1", 2), smellyCart.add("SKU-1", 2)];
    const refactored = [refactoredCart.add("SKU-1", 2), refactoredCart.add("SKU-1", 2)];

    expect(refactored).toEqual([true, false]);
    expect(refactored).toEqual(smelly);
    expect(refactoredCart.quantity("SKU-1")).toBe(smellyCart.quantity("SKU-1"));
    expect(refactoredInventory.available("SKU-1")).toBe(smellyInventory.available("SKU-1"));
  });

  it("in the smelly version anyone can corrupt the inventory", () => {
    const inventory = new Smelly.Inventory({ A: 1 });
    inventory.stock.set("A", -50);
    expect(inventory.available("A")).toBe(-50);
  });

  it("in the refactored version the internal state is not accessible", () => {
    const inventory = new Refactored.Inventory({ A: 1 });
    expect("stock" in inventory).toBe(false);
    new Refactored.Cart(inventory).add("A", 1);
    expect(inventory.reservationCount).toBe(1);
  });
});
