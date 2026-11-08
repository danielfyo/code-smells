import * as smelly from "./Smelly";
import * as refactored from "./Refactored";

describe("inconsistent-names", () => {
  it("both APIs return the same data", () => {
    expect(refactored.findCustomer(1)).toEqual(smelly.fetchUser(1));
    expect(refactored.listCustomers()).toEqual(smelly.getAllClients());
    expect(refactored.findCustomerName(2)).toBe(smelly.retrieveCustomerName(2));
    expect(refactored.findCustomerName(99)).toBe("unknown");
  });
});
