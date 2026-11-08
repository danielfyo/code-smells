import { proc } from "./Smelly";
import { totalPaidInMonth } from "./Refactored";

describe("uncommunicative-name", () => {
  it("both versions sum the month's payments", () => {
    const smellyData = [
      { n: "Anna", d: "2024-03-02", a: 100 },
      { n: "Luke", d: "2024-03-20", a: 50 },
      { n: "Eve", d: "2024-04-01", a: 70 },
    ];
    const payments = smellyData.map((p) => ({ customerName: p.n, isoDate: p.d, amount: p.a }));
    expect(proc(smellyData, "2024-03")).toBe(150);
    expect(totalPaidInMonth(payments, "2024-03")).toBe(150);
  });
});
