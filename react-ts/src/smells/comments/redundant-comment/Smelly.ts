export interface CartItem {
  sku: string;
  price: number;
  quantity: number;
}

// SMELL: redundant comments: they repeat exactly what the code already says.

/**
 * Cart class.
 */
export class Cart {
  // the list of items
  private items: CartItem[] = [];

  /**
   * Adds an item.
   * @param item the item
   */
  add(item: CartItem): void {
    // push the item onto the list of items
    this.items.push(item);
  }

  /**
   * Returns the total.
   * @returns the total
   */
  total(): number {
    // total variable initialized to zero
    let total = 0;
    // loop over the items
    for (const item of this.items) {
      // add price times quantity
      total += item.price * item.quantity;
    }
    // return the total
    return total;
  }

  // returns the number of items
  count(): number {
    return this.items.length; // length of items
  }
}
