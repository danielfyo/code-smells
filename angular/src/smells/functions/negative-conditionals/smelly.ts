import { Component, Input } from '@angular/core';

// SMELL: Negative Conditionals. Inputs named in the negative and conditions such as
// `!isNotVerified` and `!disableReminders === false` force the reader to flip logic twice.
@Component({
  selector: 'cs-negative-conditionals-smelly',
  template: `
    @if (!isNotVerified) {
      <p>Account verified</p>
    } @else {
      <p>Please verify your e-mail</p>
    }
    <p>{{ reminderText() }}</p>
  `,
})
export class AccountBannerSmelly {
  @Input() isNotVerified = false;
  @Input() disableReminders = false;
  @Input() unpaidInvoices = 0;

  reminderText(): string {
    if (!this.disableReminders === false) {
      return 'Reminders off';
    }
    if (!(this.unpaidInvoices === 0)) {
      return `You have ${this.unpaidInvoices} unpaid invoices`;
    }
    return 'All invoices paid';
  }
}
