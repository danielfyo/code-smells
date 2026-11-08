import { ChangeDetectionStrategy, Component, Injectable, inject, signal } from '@angular/core';

// REFACTOR: Encapsulate Variable + Dependency Injection. The state lives in a service whose
// lifetime is controlled by the injector; writes go through named methods and reads are
// read-only signals.
@Injectable({ providedIn: 'root' })
export class ShopSession {
  private readonly customerState = signal('guest');
  private readonly cartCountState = signal(0);

  readonly customer = this.customerState.asReadonly();
  readonly cartCount = this.cartCountState.asReadonly();

  addToCart(): void {
    this.cartCountState.update((n) => n + 1);
  }
}

@Component({
  selector: 'cs-global-data-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>{{ session.customer() }}: {{ session.cartCount() }} items</p>
    <button type="button" (click)="session.addToCart()">Add to cart</button>
  `,
})
export class CartBadgeRefactored {
  protected readonly session = inject(ShopSession);
}
