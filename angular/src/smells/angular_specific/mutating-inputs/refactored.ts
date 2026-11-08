import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface OrderLine {
  readonly product: string;
  readonly quantity: number;
}

// REFACTOR: data down, events up. The child receives a read-only line and asks the parent for a
// change through an output; the parent, which owns the state, replaces the object immutably.
@Component({
  selector: 'cs-mutating-inputs-refactored-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="line">{{ line().product }} x{{ line().quantity }}</span>
    <button type="button" class="more" (click)="quantityChange.emit(line().quantity + 1)">+</button>
  `,
})
export class OrderLineComponent {
  readonly line = input.required<OrderLine>();
  readonly quantityChange = output<number>();
}
