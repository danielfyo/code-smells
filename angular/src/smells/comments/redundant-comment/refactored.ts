import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface CartItem {
  sku: string;
  price: number;
  quantity: number;
}

// REFACTOR: Remove Comment. Expressive names (items, itemCount, total, add, clear) already tell
// the story; comments are kept for what the code cannot say (the why), and here there is none.
@Component({
  selector: 'cs-redundant-comment-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="count">{{ itemCount() }}</span>
    <span class="total">{{ total() }}</span>
  `,
})
export class CartComponent {
  readonly items = signal<CartItem[]>([]);
  readonly itemCount = computed(() => this.items().reduce((n, item) => n + item.quantity, 0));
  readonly total = computed(() => this.items().reduce((t, item) => t + item.price * item.quantity, 0));

  add(item: CartItem): void {
    this.items.update((items) => [...items, item]);
  }

  clear(): void {
    this.items.set([]);
  }
}
