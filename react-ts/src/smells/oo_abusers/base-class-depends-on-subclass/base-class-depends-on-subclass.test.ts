import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

describe("Base Class Depending on Its Derivatives", () => {
  it("payslips match across both hierarchies", () => {
    const smelly = [
      new Smelly.Employee("Rose", 1800),
      new Smelly.Manager("John", 2500, 4),
      new Smelly.SalesRep("Claire", 1500, 20000),
    ].map(Smelly.payslip);
    const refactored = [
      new Refactored.Staff("Rose", 1800),
      new Refactored.Manager("John", 2500, 4),
      new Refactored.SalesRep("Claire", 1500, 20000),
    ].map(Refactored.payslip);
    expect(refactored).toEqual(smelly);
    expect(refactored[1]).toBe("John (Manager): 2900.00 €");
  });

  it("a new kind can be added without touching the base class", () => {
    class Intern extends Refactored.Employee {
      title() {
        return "Intern";
      }
    }
    expect(Refactored.payslip(new Intern("Paul", 700))).toBe("Paul (Intern): 700.00 €");
  });
});
