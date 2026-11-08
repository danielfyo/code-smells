import { exportOrders } from "./Smelly";
import { exportOrdersAsCsv, exportOrdersAsJson } from "./Refactored";

const orders = [
  { id: "1", customer: "Nuria", total: 10 },
  { id: "2", customer: "Pol", total: 7.5 },
];

describe("Flag Arguments", () => {
  it("each function is equivalent to one branch of the flag", () => {
    expect(exportOrdersAsCsv(orders)).toBe(exportOrders(orders, true));
    expect(exportOrdersAsJson(orders)).toBe(exportOrders(orders, false));
  });

  it("produces CSV with a header", () => {
    expect(exportOrdersAsCsv(orders).split("\n")).toEqual(["id,customer,total", "1,Nuria,10.00", "2,Pol,7.50"]);
  });
});
