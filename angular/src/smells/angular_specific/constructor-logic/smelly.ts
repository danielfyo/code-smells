import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Customer, CustomerApi } from './customer.api';

@Component({
  selector: 'cs-constructor-logic-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2 class="name">{{ customer?.name }}</h2>`,
})
export class SmellyCustomerCardComponent {
  @Input() customerId?: string;
  customer?: Customer;

  // SMELL: logic in the constructor. Inputs are not set yet when the constructor runs, so the
  // request goes out with `undefined`. The constructor also does I/O, which makes the class
  // impossible to create without side effects, and later input changes are ignored.
  constructor(api: CustomerApi, cdr: ChangeDetectorRef) {
    api.load(this.customerId).subscribe((customer) => {
      this.customer = customer;
      cdr.markForCheck();
    });
  }
}
