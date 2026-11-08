import { Component, Input } from '@angular/core';

// SMELL: Artificial Coupling. Generic paging constants are declared as statics of a concrete
// invoice component. The customer list imports the invoice component only to read them, so
// two unrelated screens are now coupled (and moving or deleting the invoice table breaks it).
@Component({
  selector: 'cs-artificial-coupling-invoices-smelly',
  template: `<p>Invoices: {{ visible().join(', ') }}</p>`,
})
export class InvoiceTableSmelly {
  static readonly PAGE_SIZE = 3;
  static readonly FIRST_PAGE = 1;

  @Input() invoices: string[] = [];
  @Input() page = InvoiceTableSmelly.FIRST_PAGE;

  visible(): string[] {
    const start = (this.page - 1) * InvoiceTableSmelly.PAGE_SIZE;
    return this.invoices.slice(start, start + InvoiceTableSmelly.PAGE_SIZE);
  }
}

@Component({
  selector: 'cs-artificial-coupling-customers-smelly',
  template: `<p>Customers: {{ visible().join(', ') }}</p>`,
})
export class CustomerListSmelly {
  @Input() customers: string[] = [];
  @Input() page = InvoiceTableSmelly.FIRST_PAGE;

  visible(): string[] {
    const start = (this.page - 1) * InvoiceTableSmelly.PAGE_SIZE;
    return this.customers.slice(start, start + InvoiceTableSmelly.PAGE_SIZE);
  }
}
