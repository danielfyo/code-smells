export interface Employee {
  name: string;
  hourlyRate: number;
  hours: number;
}

// REFACTOR: related constants are grouped together, close to the code that uses them.
const OVERTIME_THRESHOLD = 40;
const OVERTIME_MULTIPLIER = 1.5;
const CURRENCY = "€";

// REFACTOR: helpers sit right before (or after) their caller, top to bottom, so the
// file reads like a newspaper.
function overtimeHours(employee: Employee): number {
  return Math.max(0, employee.hours - OVERTIME_THRESHOLD);
}

function grossPay(employee: Employee): number {
  const regular = Math.min(employee.hours, OVERTIME_THRESHOLD);
  return employee.hourlyRate * (regular + overtimeHours(employee) * OVERTIME_MULTIPLIER);
}

export function payrollSummary(employees: Employee[]): string[] {
  const payLines = employees.map((employee) => `${employee.name}: ${grossPay(employee).toFixed(2)} ${CURRENCY}`);
  // REFACTOR: each variable is declared right where it is needed.
  const totalOvertimeHours = employees.reduce((sum, employee) => sum + overtimeHours(employee), 0);
  return ["Weekly payroll", ...payLines, `Overtime hours: ${totalOvertimeHours}`];
}
