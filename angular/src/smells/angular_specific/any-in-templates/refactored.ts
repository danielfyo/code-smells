import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Address {
  street: string;
  city: string;
}

export interface Order {
  customer: { name: string; address?: Address };
  total: number;
  lines: { sku: string; quantity: number }[];
}

// REFACTOR: type the data and drop the casts. With a real interface, strictTemplates checks every
// property path in the template, so "adress", "totl" or "lenght" fail the build instead of
// rendering blanks. Optional data is modelled as optional and read with `?.`.
@Component({
  selector: 'cs-any-in-templates-refactored',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="customer">{{ order().customer.name }} ({{ order().customer.address?.city }})</p>
    <p class="total">{{ order().total | number: '1.2-2' }} EUR</p>
    <p class="items">{{ order().lines.length }} lines</p>
  `,
})
export class OrderCardComponent {
  readonly order = input.required<Order>();
}
