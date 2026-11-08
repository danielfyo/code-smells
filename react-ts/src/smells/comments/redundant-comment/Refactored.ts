export interface CartItem {
  sku: string;
  price: number;
  quantity: number;
}

// REFACTOR: comments that paraphrase the code are removed. Good names (Cart, add, total,
// count) already document the intent; only what adds information is kept.
export class Cart {
  private items: CartItem[] = [];

  add(item: CartItem): void {
    this.items.push(item);
  }

  total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /** Number of distinct lines (not units). */
  // REFACTOR: the only comment kept: it clarifies a real ambiguity.
  count(): number {
    return this.items.length;
  }
}
