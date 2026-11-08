import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface Product {
  name: string;
  price: number;
}

// SMELL: default (eager) change detection everywhere. With `Eager` (formerly `Default`) Angular
// re-checks this card whenever its parent is checked, even if none of its inputs changed. In a
// grid of hundreds of cards, every keystroke anywhere above them re-renders all of them.
@Component({
  selector: 'cs-default-change-detection-smelly',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<article class="card">{{ product.name }} - {{ product.price }} EUR{{ renderProbe() }}</article>`,
})
export class SmellyProductCardComponent {
  @Input({ required: true }) product!: Product;
  renders = 0;

  /** Test probe: counts how many times the template is evaluated. Renders nothing. */
  renderProbe(): string {
    this.renders++;
    return '';
  }
}
