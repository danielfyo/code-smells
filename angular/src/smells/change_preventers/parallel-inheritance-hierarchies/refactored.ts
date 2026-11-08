// REFACTOR: Move Method / Collapse Hierarchy. Each staff member exposes what the payslip needs
// (role and bonus), so the formatter hierarchy collapses into one function and a new role is a
// single new class.
export abstract class StaffMember {
  constructor(
    readonly name: string,
    readonly baseSalary: number,
  ) {}

  abstract readonly role: string;
  abstract bonus(): number;
}

export class Engineer extends StaffMember {
  readonly role = 'Engineer';

  constructor(
    name: string,
    baseSalary: number,
    readonly onCallWeeks: number,
  ) {
    super(name, baseSalary);
  }

  bonus(): number {
    return this.onCallWeeks * 150;
  }
}

export class Manager extends StaffMember {
  readonly role = 'Manager';

  constructor(
    name: string,
    baseSalary: number,
    readonly reports: number,
  ) {
    super(name, baseSalary);
  }

  bonus(): number {
    return this.reports * 100;
  }
}

export function payslipFor(member: StaffMember): string {
  return `${member.name} (${member.role}): ${member.baseSalary + member.bonus()}`;
}
