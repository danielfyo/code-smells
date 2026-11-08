import { ChangeDetectionStrategy, Component, Injectable, inject } from '@angular/core';

export interface WishlistItem {
  sku: string;
  name: string;
}

// SMELL: public mutable service state. Any component can push to, splice or replace the array,
// and nothing tells the rest of the app that it changed. OnPush/zoneless views reading it go
// stale, and there is no single place that enforces rules such as "no duplicates".
@Injectable({ providedIn: 'root' })
export class SmellyWishlistService {
  items: WishlistItem[] = [];
}

@Component({
  selector: 'cs-mutable-service-state-smelly-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" class="add" (click)="add()">Add to wishlist</button>`,
})
export class SmellyAddToWishlistComponent {
  private readonly wishlist = inject(SmellyWishlistService);

  add(): void {
    this.wishlist.items.push({ sku: 'LAMP-1', name: 'Desk lamp' });
  }
}

@Component({
  selector: 'cs-mutable-service-state-smelly-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="counter">{{ wishlist.items.length }} saved</span>`,
})
export class SmellyWishlistCounterComponent {
  protected readonly wishlist = inject(SmellyWishlistService);
}
