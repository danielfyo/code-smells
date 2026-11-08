import { Injectable, computed, signal } from '@angular/core';

// Production code: a signal-based shopping cart store.
export interface CartEntry {
  sku: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly entries = signal<readonly CartEntry[]>([]);

  readonly items = this.entries.asReadonly();
  readonly total = computed(() => this.entries().reduce((sum, e) => sum + e.price * e.quantity, 0));

  add(sku: string, price: number): void {
    this.entries.update((entries) =>
      entries.some((e) => e.sku === sku)
        ? entries.map((e) => (e.sku === sku ? { ...e, quantity: e.quantity + 1 } : e))
        : [...entries, { sku, price, quantity: 1 }],
    );
  }

  remove(sku: string): void {
    this.entries.update((entries) => entries.filter((e) => e.sku !== sku));
  }

  clear(): void {
    this.entries.set([]);
  }
}
