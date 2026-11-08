// SMELL: Base Class Depending on Its Derivatives. The `Employee` base class
// knows its subclasses and asks `instanceof` to decide. Adding a new kind of
// employee forces us to modify the base (violates open/closed), and the base
// cannot be compiled or understood without its children.
export class Employee {
  constructor(
    readonly name: string,
    readonly baseSalary: number,
  ) {}

  monthlyPay(): number {
    if (this instanceof Manager) {
      return this.baseSalary + this.teamSize * 100;
    }
    if (this instanceof SalesRep) {
      return this.baseSalary + this.salesVolume * 0.05;
    }
    return this.baseSalary;
  }

  title(): string {
    // SMELL: the base enumerates the names of its derived classes.
    if (this instanceof Manager) return "Manager";
    if (this instanceof SalesRep) return "Sales rep";
    return "Employee";
  }
}

export class Manager extends Employee {
  constructor(name: string, baseSalary: number, readonly teamSize: number) {
    super(name, baseSalary);
  }
}

export class SalesRep extends Employee {
  constructor(name: string, baseSalary: number, readonly salesVolume: number) {
    super(name, baseSalary);
  }
}

export const payslip = (e: Employee): string => `${e.name} (${e.title()}): ${e.monthlyPay().toFixed(2)} €`;
