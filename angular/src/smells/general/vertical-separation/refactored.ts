import { Injectable } from '@angular/core';

export interface Employee {
  name: string;
  hourlyRate: number;
  hours: number;
}

// REFACTOR: Move Declaration Closer to Usage / Slide Statements. Constants sit right above the
// functions that use them, locals are declared where they are first needed and each helper
// follows its caller (the "newspaper" ordering).
@Injectable({ providedIn: 'root' })
export class PayrollService {
  weeklySummary(employees: readonly Employee[]): string[] {
    const employeeLines = employees.map((employee) => `${employee.name}: ${money(grossPay(employee))}`);
    const overtime = employees.reduce((sum, employee) => sum + overtimeHours(employee), 0);
    const total = employees.reduce((sum, employee) => sum + grossPay(employee), 0);
    return ['Weekly payroll', ...employeeLines, `Overtime hours: ${overtime}`, `Total: ${money(total)}`];
  }

  employeeCount(employees: readonly Employee[]): number {
    return employees.length;
  }

  hasOvertime(employee: Employee): boolean {
    return overtimeHours(employee) > 0;
  }
}

const OVERTIME_THRESHOLD = 40;
const OVERTIME_MULTIPLIER = 1.5;

function overtimeHours(employee: Employee): number {
  return Math.max(0, employee.hours - OVERTIME_THRESHOLD);
}

function grossPay(employee: Employee): number {
  const regularHours = employee.hours - overtimeHours(employee);
  return (regularHours + overtimeHours(employee) * OVERTIME_MULTIPLIER) * employee.hourlyRate;
}

function money(amount: number): string {
  return `${amount.toFixed(2)} EUR`;
}
