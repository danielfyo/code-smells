import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

// REFACTOR: describe the view declaratively. Text, classes and visibility are bindings derived
// from state, so each instance renders only its own template and the DOM always matches the state.
@Component({
  selector: 'cs-direct-dom-manipulation-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <span class="stock-badge" [class.in-stock]="inStock()" [class.sold-out]="!inStock()">{{ label() }}</span>
    }
    <button type="button" class="hide" (click)="visible.set(false)">Hide</button>
  `,
})
export class StockBadgeComponent {
  readonly units = input.required<number>();
  readonly visible = signal(true);
  readonly inStock = computed(() => this.units() > 0);
  readonly label = computed(() => (this.inStock() ? `${this.units()} in stock` : 'Sold out'));
}
