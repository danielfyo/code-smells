import { Injectable } from '@angular/core';

export interface Cart {
  id: string;
  items: string[];
}

const CART_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartSessionService {
  private nextId = 1;

  // REFACTOR: Separate Query from Modifier and name the side effect. `findCart` is a pure query;
  // `getOrCreateCart` says out loud that it may create and persist a cart.
  findCart(): Cart | null {
    const stored = sessionStorage.getItem(CART_KEY);
    return stored ? (JSON.parse(stored) as Cart) : null;
  }

  getOrCreateCart(): Cart {
    return this.findCart() ?? this.createCart();
  }

  private createCart(): Cart {
    const cart: Cart = { id: `cart-${this.nextId++}`, items: [] };
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  }
}
