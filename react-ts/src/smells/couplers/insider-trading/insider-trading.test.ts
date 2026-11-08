import * as Smelly from "./Smelly";
import { Accounting, OrderService } from "./Refactored";

const orders = [
  { id: "P-1", total: 30 },
  { id: "P-2", total: 12.5 },
];

describe("Insider Trading", () => {
  beforeEach(() => Smelly.reset());

  it("both versions close the day with the same ledger entries", () => {
    orders.forEach((o) => Smelly.orderModule.place(o));
    const smellyRevenue = Smelly.accountingModule.closeDay();

    const accounting = new Accounting();
    const service = new OrderService(accounting);
    orders.forEach((o) => service.place(o));
    const revenue = accounting.closeDay();

    expect(revenue).toBe(smellyRevenue);
    expect(accounting.ledger).toEqual(Smelly.accountingModule.ledger);
    expect(service.placed).toEqual(Smelly.orderModule.placed);
    expect(accounting.closeDay()).toBe(0);
  });

  it("in the smelly version a third party can tamper with the internal exchange", () => {
    Smelly.orderModule.place(orders[0]);
    Smelly.orderModule._pendingInvoices.push({ id: "FAKE", total: 999 });
    expect(Smelly.accountingModule.closeDay()).toBe(1029);
  });
});
