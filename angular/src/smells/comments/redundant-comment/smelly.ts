import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface CartItem {
  sku: string;
  price: number;
  quantity: number;
}

/**
 * The shopping cart component.
 * SMELL: redundant comments everywhere. Each one repeats what the code already says, adds noise
 * and doubles the maintenance (every change must be made twice, in code and in comment).
 */
@Component({
  // The selector of the component.
  selector: 'cs-redundant-comment-smelly',
  // The change detection strategy is OnPush.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The template of the component.
  template: `
    <!-- Show the number of items -->
    <span class="count">{{ itemCount() }}</span>
    <!-- Show the total -->
    <span class="total">{{ total() }}</span>
  `,
})
export class SmellyCartComponent {
  /** The items. */
  readonly items = signal<CartItem[]>([]);

  /** The item count: the sum of the quantities of the items. */
  readonly itemCount = computed(() => this.items().reduce((n, item) => n + item.quantity, 0));

  /** The total: the sum of price times quantity. */
  readonly total = computed(() => this.items().reduce((t, item) => t + item.price * item.quantity, 0));

  /**
   * Adds an item.
   * @param item the item
   */
  add(item: CartItem): void {
    // Update the items signal appending the item.
    this.items.update((items) => [...items, item]);
  }

  /** Clears the cart. */
  clear(): void {
    // Set items to an empty array.
    this.items.set([]);
  }
}
