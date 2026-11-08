import { ChangeDetectionStrategy, Component, Injectable, computed, inject, input } from '@angular/core';
import type { Employee } from './model';

// REFACTOR: Extract Class / Split Phase. Each reason to change now has its own home.

// Finance owns the tax rules.
export function netMonthlySalary(grossYearly: number): number {
  const tax = grossYearly <= 20_000 ? grossYearly * 0.15 : 3_000 + (grossYearly - 20_000) * 0.3;
  return (grossYearly - tax) / 12;
}

// IT owns the address policy.
export function isCorporateEmail(email: string): boolean {
  return /^[^@\s]+@company\.test$/.test(email);
}

// The payroll integration owns the file format.
@Injectable({ providedIn: 'root' })
export class PayrollCsvExporter {
  line(employee: Employee): string {
    return [employee.name.toUpperCase(), employee.email, netMonthlySalary(employee.grossYearly).toFixed(2)].join(';');
  }
}

// UX owns only the presentation.
@Component({
  selector: 'cs-divergent-change-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article>
      <h3>{{ employee().name }}</h3>
      <p>Net monthly: {{ net().toFixed(2) }}</p>
      <p>{{ emailOk() ? employee().email : 'Invalid e-mail' }}</p>
      <code>{{ csvLine() }}</code>
    </article>
  `,
})
export class EmployeeCardRefactored {
  readonly employee = input.required<Employee>();
  private readonly exporter = inject(PayrollCsvExporter);

  protected readonly net = computed(() => netMonthlySalary(this.employee().grossYearly));
  protected readonly emailOk = computed(() => isCorporateEmail(this.employee().email));
  protected readonly csvLine = computed(() => this.exporter.line(this.employee()));
}
