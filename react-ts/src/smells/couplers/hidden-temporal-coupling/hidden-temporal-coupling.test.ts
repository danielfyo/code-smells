import { SalesReport } from "./Smelly";
import { buildSalesReport } from "./Refactored";

const sales = [
  { region: "North", amount: 100 },
  { region: "South", amount: 40.5 },
  { region: "North", amount: 20 },
];

describe("Hidden Temporal Coupling", () => {
  it("with the right order both versions agree", () => {
    const report = new SalesReport();
    report.setData(sales);
    report.setCurrency("EUR");
    expect(buildSalesReport(sales, { currency: "EUR" })).toEqual(report.build());
    expect(report.build()).toEqual(["North: 120.00 EUR", "South: 40.50 EUR"]);
  });

  it("the smelly version fails silently if a step is forgotten", () => {
    const report = new SalesReport();
    report.setCurrency("EUR");
    expect(report.build()).toEqual([]); // forgot setData: empty report, no error

    const other = new SalesReport();
    other.setData(sales);
    expect(other.build()[0]).toBe("North: 120.00 USD"); // forgot setCurrency
  });
});
