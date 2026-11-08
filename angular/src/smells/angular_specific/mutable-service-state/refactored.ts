import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';

export interface WishlistItem {
  readonly sku: string;
  readonly name: string;
}

// REFACTOR: Encapsulate state behind a signal store. The writable signal is private; consumers get
// read-only signals and intention-revealing methods. Every change is immutable and notifies all
// readers, and the store enforces its own rules (no duplicates).
@Injectable({ providedIn: 'root' })
export class WishlistStore {
  private readonly state = signal<readonly WishlistItem[]>([]);
  readonly items = this.state.asReadonly();
  readonly count = computed(() => this.state().length);

  add(item: WishlistItem): void {
    this.state.update((items) => (items.some((i) => i.sku === item.sku) ? items : [...items, item]));
  }
}

@Component({
  selector: 'cs-mutable-service-state-refactored-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" class="add" (click)="add()">Add to wishlist</button>`,
})
export class AddToWishlistComponent {
  private readonly wishlist = inject(WishlistStore);

  add(): void {
    this.wishlist.add({ sku: 'LAMP-1', name: 'Desk lamp' });
  }
}

@Component({
  selector: 'cs-mutable-service-state-refactored-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="counter">{{ count() }} saved</span>`,
})
export class WishlistCounterComponent {
  protected readonly count = inject(WishlistStore).count;
}
