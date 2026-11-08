import { Component, Input } from '@angular/core';
import type { Appointment, Invoice } from './model';

// SMELL: Duplicate Code. Both components contain the same "days between two ISO dates" math and
// the same "today / in N days / N days ago" wording. A fix to one (time zones, singular "day")
// has to be repeated in the other, and it is easy to miss.
@Component({
  selector: 'cs-duplicate-code-appointments-smelly',
  template: `
    @for (item of appointments; track item.title) {
      <p>{{ item.title }}: {{ label(item.date) }}</p>
    }
  `,
})
export class AppointmentListSmelly {
  @Input() appointments: Appointment[] = [];
  @Input() today = '';

  label(date: string): string {
    const diff = Math.round((Date.parse(date) - Date.parse(this.today)) / 86_400_000);
    if (diff === 0) return 'today';
    return diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
  }
}

@Component({
  selector: 'cs-duplicate-code-invoices-smelly',
  template: `
    @for (invoice of invoices; track invoice.number) {
      <p>Invoice #{{ invoice.number }}: {{ dueLabel(invoice.dueDate) }}</p>
    }
  `,
})
export class InvoiceListSmelly {
  @Input() invoices: Invoice[] = [];
  @Input() today = '';

  // SMELL: copy-pasted from AppointmentListSmelly with a different name.
  dueLabel(dueDate: string): string {
    const days = Math.round((Date.parse(dueDate) - Date.parse(this.today)) / 86_400_000);
    if (days === 0) return 'today';
    return days > 0 ? `in ${days} days` : `${-days} days ago`;
  }
}
