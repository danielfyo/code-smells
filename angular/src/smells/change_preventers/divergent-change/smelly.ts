import { Component, Input } from '@angular/core';
import type { Employee } from './model';

// SMELL: Divergent Change. This one component is edited when the tax brackets change (finance),
// when the CSV layout changes (the payroll provider), when e-mail validation changes (IT) and
// when the card design changes (UX). Four unrelated reasons to change, one class.
@Component({
  selector: 'cs-divergent-change-smelly',
  template: `
    <article>
      <h3>{{ employee.name }}</h3>
      <p>Net monthly: {{ netMonthly().toFixed(2) }}</p>
      <p>{{ emailOk() ? employee.email : 'Invalid e-mail' }}</p>
      <code>{{ csvLine() }}</code>
    </article>
  `,
})
export class EmployeeCardSmelly {
  @Input({ required: true }) employee!: Employee;

  // Reason 1: tax law.
  netMonthly(): number {
    const gross = this.employee.grossYearly;
    const tax = gross <= 20_000 ? gross * 0.15 : 3_000 + (gross - 20_000) * 0.3;
    return (gross - tax) / 12;
  }

  // Reason 2: IT policy for addresses.
  emailOk(): boolean {
    return /^[^@\s]+@company\.test$/.test(this.employee.email);
  }

  // Reason 3: payroll provider file format.
  csvLine(): string {
    return [this.employee.name.toUpperCase(), this.employee.email, this.netMonthly().toFixed(2)].join(';');
  }
}
