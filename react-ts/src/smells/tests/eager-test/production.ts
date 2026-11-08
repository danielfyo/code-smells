// Production code: shopping cart with discounts.
export interface Item {
  sku: string;
  price: number;
  quantity: number;
}

export class ShoppingCart {
  private items = new Map<string, Item>();

  add(item: Item): void {
    const existing = this.items.get(item.sku);
    const quantity = (existing?.quantity ?? 0) + item.quantity;
    this.items.set(item.sku, { ...item, quantity });
  }

  remove(sku: string): void {
    this.items.delete(sku);
  }

  quantityOf(sku: string): number {
    return this.items.get(sku)?.quantity ?? 0;
  }

  total(discountPercent = 0): number {
    const gross = [...this.items.values()].reduce((sum, i) => sum + i.price * i.quantity, 0);
    return Math.round(gross * (1 - discountPercent / 100) * 100) / 100;
  }
}
