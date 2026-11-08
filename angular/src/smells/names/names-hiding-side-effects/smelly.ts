import { Injectable } from '@angular/core';

export interface Cart {
  id: string;
  items: string[];
}

@Injectable({ providedIn: 'root' })
export class SmellyCartSessionService {
  private nextId = 1;

  // SMELL: the name hides side effects. A "get" reads like a harmless query, but this one creates
  // a new cart, writes it to storage and bumps a counter when none exists. Calling it from a
  // template, a guard or a log line silently persists carts.
  getCart(): Cart {
    const stored = sessionStorage.getItem('cart');
    if (stored) return JSON.parse(stored) as Cart;
    const cart: Cart = { id: `cart-${this.nextId++}`, items: [] };
    sessionStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  }
}
