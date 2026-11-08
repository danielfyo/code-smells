// SMELL: vertical separation. Variables are declared far from where they are used and
// helper functions are scattered far away from their only caller.
export interface Employee {
  name: string;
  hourlyRate: number;
  hours: number;
}

const OVERTIME_THRESHOLD = 40; // SMELL: declared up here, but mainly used at the bottom of the file.

export function payrollSummary(employees: Employee[]): string[] {
  const lines: string[] = [];
  let totalOvertimeHours = 0; // SMELL: declared here, used 15 lines below.
  const header = "Weekly payroll"; // SMELL: declared here, used at the very end.
  const currency = "€";

  for (const employee of employees) {
    const pay = grossPay(employee);
    lines.push(`${employee.name}: ${pay.toFixed(2)} ${currency}`);
  }

  for (const employee of employees) {
    totalOvertimeHours += Math.max(0, employee.hours - OVERTIME_THRESHOLD);
  }

  lines.push(`Overtime hours: ${totalOvertimeHours}`);
  return [header, ...lines];
}

export function unrelatedHelperA(): string {
  return "filler";
}

export function unrelatedHelperB(): number {
  return 42;
}

const OVERTIME_MULTIPLIER = 1.5; // SMELL: constant far from its only use.

// SMELL: the helper sits at the end of the file, far from payrollSummary, which uses it.
function grossPay(employee: Employee): number {
  const regular = Math.min(employee.hours, OVERTIME_THRESHOLD);
  const overtime = Math.max(0, employee.hours - OVERTIME_THRESHOLD);
  return employee.hourlyRate * (regular + overtime * OVERTIME_MULTIPLIER);
}
