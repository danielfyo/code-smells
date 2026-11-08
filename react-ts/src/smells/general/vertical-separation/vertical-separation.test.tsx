import { payrollSummary as smelly } from "./Smelly";
import { payrollSummary as refactored } from "./Refactored";

describe("vertical-separation", () => {
  it("both versions produce the same payroll summary", () => {
    const employees = [
      { name: "Anna", hourlyRate: 20, hours: 45 },
      { name: "Luke", hourlyRate: 15, hours: 30 },
    ];
    const expected = ["Weekly payroll", "Anna: 950.00 €", "Luke: 450.00 €", "Overtime hours: 5"];
    expect(smelly(employees)).toEqual(expected);
    expect(refactored(employees)).toEqual(expected);
  });
});
