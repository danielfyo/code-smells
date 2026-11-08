import { Component } from '@angular/core';

// SMELL: Global Data. A module-level mutable object that any file can import and change.
// Nobody knows who modified `cartCount`, and the value survives across tests and screens.
export const shopSession = {
  customer: 'guest',
  cartCount: 0,
};

@Component({
  selector: 'cs-global-data-smelly',
  template: `
    <p>{{ session.customer }}: {{ session.cartCount }} items</p>
    <button type="button" (click)="add()">Add to cart</button>
  `,
})
export class CartBadgeSmelly {
  readonly session = shopSession;

  add(): void {
    shopSession.cartCount++;
  }
}
