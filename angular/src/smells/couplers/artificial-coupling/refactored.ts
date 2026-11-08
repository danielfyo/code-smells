import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FIRST_PAGE, pageOf } from './pagination';

// REFACTOR: both components depend on the shared pagination module, not on each other.
@Component({
  selector: 'cs-artificial-coupling-invoices-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Invoices: {{ visible().join(', ') }}</p>`,
})
export class InvoiceTableRefactored {
  readonly invoices = input<readonly string[]>([]);
  readonly page = input(FIRST_PAGE);
  protected readonly visible = computed(() => pageOf(this.invoices(), this.page()));
}

@Component({
  selector: 'cs-artificial-coupling-customers-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Customers: {{ visible().join(', ') }}</p>`,
})
export class CustomerListRefactored {
  readonly customers = input<readonly string[]>([]);
  readonly page = input(FIRST_PAGE);
  protected readonly visible = computed(() => pageOf(this.customers(), this.page()));
}
