// REFACTOR: Replace Conditional with Polymorphism. The base declares an
// extension point (`bonus()` and `title()`) and knows nothing about who extends it.
export abstract class Employee {
  constructor(
    readonly name: string,
    readonly baseSalary: number,
  ) {}

  // REFACTOR: Template Method: the shared algorithm lives in the base...
  monthlyPay(): number {
    return this.baseSalary + this.bonus();
  }

  // ...and the variations are supplied by the subclasses.
  protected bonus(): number {
    return 0;
  }

  abstract title(): string;
}

export class Staff extends Employee {
  title(): string {
    return "Employee";
  }
}

export class Manager extends Employee {
  constructor(name: string, baseSalary: number, readonly teamSize: number) {
    super(name, baseSalary);
  }
  protected override bonus(): number {
    return this.teamSize * 100;
  }
  title(): string {
    return "Manager";
  }
}

export class SalesRep extends Employee {
  constructor(name: string, baseSalary: number, readonly salesVolume: number) {
    super(name, baseSalary);
  }
  protected override bonus(): number {
    return this.salesVolume * 0.05;
  }
  title(): string {
    return "Sales rep";
  }
}

export const payslip = (e: Employee): string => `${e.name} (${e.title()}): ${e.monthlyPay().toFixed(2)} €`;
