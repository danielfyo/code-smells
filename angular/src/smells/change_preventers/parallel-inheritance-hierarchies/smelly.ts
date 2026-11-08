// SMELL: Parallel Inheritance Hierarchies. Every StaffMember subclass needs a twin
// PayslipFormatter subclass. Adding "Contractor" means two new classes plus a new branch in the
// factory that pairs them; forget one and payslips break at runtime.
export abstract class StaffMemberSmelly {
  constructor(
    readonly name: string,
    readonly baseSalary: number,
  ) {}
}

export class EngineerSmelly extends StaffMemberSmelly {
  constructor(
    name: string,
    baseSalary: number,
    readonly onCallWeeks: number,
  ) {
    super(name, baseSalary);
  }
}

export class ManagerSmelly extends StaffMemberSmelly {
  constructor(
    name: string,
    baseSalary: number,
    readonly reports: number,
  ) {
    super(name, baseSalary);
  }
}

export abstract class PayslipFormatterSmelly<T extends StaffMemberSmelly> {
  abstract format(member: T): string;
}

export class EngineerPayslipSmelly extends PayslipFormatterSmelly<EngineerSmelly> {
  format(e: EngineerSmelly): string {
    return `${e.name} (Engineer): ${e.baseSalary + e.onCallWeeks * 150}`;
  }
}

export class ManagerPayslipSmelly extends PayslipFormatterSmelly<ManagerSmelly> {
  format(m: ManagerSmelly): string {
    return `${m.name} (Manager): ${m.baseSalary + m.reports * 100}`;
  }
}

export function payslipFor(member: StaffMemberSmelly): string {
  if (member instanceof EngineerSmelly) return new EngineerPayslipSmelly().format(member);
  if (member instanceof ManagerSmelly) return new ManagerPayslipSmelly().format(member);
  throw new Error(`No payslip formatter for ${member.name}`);
}
