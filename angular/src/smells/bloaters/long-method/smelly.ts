import { Component, Input } from '@angular/core';
import type { TimeEntry } from './model';

// SMELL: Long Method. One getter collects billable hours, applies the rush surcharge, the
// volume discount, the withholding tax and builds every display line. Each new billing rule
// makes it longer, and none of the steps can be reused or tested on its own.
@Component({
  selector: 'cs-long-method-smelly',
  template: `
    <section>
      @for (line of summaryLines; track $index) {
        <p>{{ line }}</p>
      }
    </section>
  `,
})
export class FreelanceInvoiceSmelly {
  @Input() entries: TimeEntry[] = [];
  @Input() hourlyRate = 0;
  @Input() rush = false;

  get summaryLines(): string[] {
    const lines: string[] = [];
    // SMELL: step 1 - filtering and summing hours by hand.
    let hours = 0;
    for (const entry of this.entries) {
      if (entry.billable) {
        hours += entry.hours;
        lines.push(entry.task + ': ' + entry.hours.toFixed(1) + ' h');
      }
    }
    // SMELL: step 2 - pricing rules buried in the middle of the method.
    let fee = hours * this.hourlyRate;
    if (this.rush) {
      fee = fee * 1.25;
    }
    // SMELL: step 3 - discount policy mixed with the rest.
    let discount = 0;
    if (hours > 40) {
      discount = fee * 0.05;
    }
    // SMELL: step 4 - tax rules and formatting interleaved.
    const net = fee - discount;
    const withholding = net * 0.15;
    lines.push('Fee: ' + fee.toFixed(2));
    if (discount > 0) {
      lines.push('Volume discount: -' + discount.toFixed(2));
    }
    lines.push('Withholding: -' + withholding.toFixed(2));
    lines.push('To pay: ' + (net - withholding).toFixed(2));
    return lines;
  }
}
