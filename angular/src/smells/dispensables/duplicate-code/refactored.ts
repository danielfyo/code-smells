import { ChangeDetectionStrategy, Component, Pipe, type PipeTransform, input } from '@angular/core';
import type { Appointment, Invoice } from './model';

const MS_PER_DAY = 86_400_000;

// REFACTOR: Extract Function. The calculation and the wording exist once.
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(toIso) - Date.parse(fromIso)) / MS_PER_DAY);
}

export function relativeDay(dateIso: string, todayIso: string): string {
  const days = daysBetween(todayIso, dateIso);
  if (days === 0) return 'today';
  return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

// REFACTOR: wrap it in a pure pipe so any template can reuse it.
@Pipe({ name: 'relativeDay' })
export class RelativeDayPipe implements PipeTransform {
  transform(dateIso: string, todayIso: string): string {
    return relativeDay(dateIso, todayIso);
  }
}

@Component({
  selector: 'cs-duplicate-code-appointments-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RelativeDayPipe],
  template: `
    @for (item of appointments(); track item.title) {
      <p>{{ item.title }}: {{ item.date | relativeDay: today() }}</p>
    }
  `,
})
export class AppointmentListRefactored {
  readonly appointments = input<readonly Appointment[]>([]);
  readonly today = input('');
}

@Component({
  selector: 'cs-duplicate-code-invoices-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RelativeDayPipe],
  template: `
    @for (invoice of invoices(); track invoice.number) {
      <p>Invoice #{{ invoice.number }}: {{ invoice.dueDate | relativeDay: today() }}</p>
    }
  `,
})
export class InvoiceListRefactored {
  readonly invoices = input<readonly Invoice[]>([]);
  readonly today = input('');
}
