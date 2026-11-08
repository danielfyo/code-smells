import { Injectable } from '@angular/core';

export interface Employee {
  name: string;
  hourlyRate: number;
  hours: number;
}

// SMELL: declared at the top of the file, used only by a helper at the very bottom.
const OVERTIME_THRESHOLD = 40;

@Injectable({ providedIn: 'root' })
export class SmellyPayrollService {
  // SMELL: vertical separation. Locals are declared long before their first use and the helpers
  // this method relies on sit far below, after unrelated members. The reader keeps scrolling.
  weeklySummary(employees: readonly Employee[]): string[] {
    const header = 'Weekly payroll'; // used at the very end
    const currency = 'EUR'; // used inside the loop, much later
    let overtimeHours = 0; // used after the loop
    const lines: string[] = [];
    let total = 0;

    for (const employee of employees) {
      const pay = this.grossPay(employee);
      total += pay;
      overtimeHours += Math.max(0, employee.hours - OVERTIME_THRESHOLD);
      lines.push(`${employee.name}: ${pay.toFixed(2)} ${currency}`);
    }

    lines.push(`Overtime hours: ${overtimeHours}`);
    lines.push(`Total: ${total.toFixed(2)} ${currency}`);
    return [header, ...lines];
  }

  // Unrelated member placed between the caller and its helper.
  employeeCount(employees: readonly Employee[]): number {
    return employees.length;
  }

  hasOvertime(employee: Employee): boolean {
    return employee.hours > OVERTIME_THRESHOLD;
  }

  private grossPay(employee: Employee): number {
    const regular = Math.min(employee.hours, OVERTIME_THRESHOLD) * employee.hourlyRate;
    const extra = Math.max(0, employee.hours - OVERTIME_THRESHOLD) * employee.hourlyRate * 1.5;
    return regular + extra;
  }
}
