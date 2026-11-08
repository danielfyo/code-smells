import { CustomerDirectory as SmellyDirectory } from "./Smelly";
import { CustomerDirectory as RefactoredDirectory } from "./Refactored";

describe("encodings-in-names", () => {
  it("both versions list active customers and the total", () => {
    const smelly = new SmellyDirectory();
    smelly.addCustomer({ strName: "Anna", nAge: 30, bActive: true });
    smelly.addCustomer({ strName: "Luke", nAge: 41, bActive: false });

    const refactored = new RefactoredDirectory();
    refactored.addCustomer({ name: "Anna", age: 30, active: true });
    refactored.addCustomer({ name: "Luke", age: 41, active: false });

    expect(smelly.getActiveNames()).toEqual(["Anna"]);
    expect(refactored.getActiveNames()).toEqual(["Anna"]);
    expect(smelly.getTotal()).toBe("2 customers");
    expect(refactored.getTotal()).toBe(smelly.getTotal());
  });
});
