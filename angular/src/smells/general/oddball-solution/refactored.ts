import { ChangeDetectionStrategy, Component, Pipe, PipeTransform, input } from '@angular/core';

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  discount: number;
}

const EURO_FORMAT = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// REFACTOR: Substitute Algorithm / pick one solution. A single pure pipe formats every amount,
// so all amounts behave the same (rounding, separators) and fixes happen in one place.
@Pipe({ name: 'euros' })
export class EurosPipe implements PipeTransform {
  transform(amount: number): string {
    return EURO_FORMAT.format(amount);
  }
}

@Component({
  selector: 'cs-oddball-solution-refactored',
  imports: [EurosPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="subtotal">{{ order().subtotal | euros }}</p>
    <p class="shipping">{{ order().shipping | euros }}</p>
    <p class="discount">{{ order().discount | euros }}</p>
  `,
})
export class OrderSummaryComponent {
  readonly order = input.required<OrderSummary>();
}
