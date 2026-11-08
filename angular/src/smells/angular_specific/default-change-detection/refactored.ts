import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Product {
  name: string;
  price: number;
}

// REFACTOR: OnPush + signal inputs. The card is re-checked only when one of its inputs gets a new
// reference, a signal it reads changes or it handles an event, not whenever an ancestor is checked.
@Component({
  selector: 'cs-default-change-detection-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<article class="card">{{ product().name }} - {{ product().price }} EUR{{ renderProbe() }}</article>`,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  renders = 0;

  /** Test probe: counts how many times the template is evaluated. Renders nothing. */
  renderProbe(): string {
    this.renders++;
    return '';
  }
}
