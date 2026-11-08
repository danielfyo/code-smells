import { Injectable, inject } from '@angular/core';

// REFACTOR: Move Function / Hide internals behind an explicit interface. The warehouse owns
// stock AND reservations and exposes intention-revealing operations; the order desk only uses
// that public API. The dependency now goes one way.
@Injectable({ providedIn: 'root' })
export class Warehouse {
  private readonly stock = new Map<string, number>([
    ['LAMP', 3],
    ['DESK', 1],
  ]);
  private readonly reserved = new Map<string, number>();

  available(sku: string): number {
    return (this.stock.get(sku) ?? 0) - (this.reserved.get(sku) ?? 0);
  }

  reserve(sku: string): boolean {
    if (this.available(sku) <= 0) return false;
    this.reserved.set(sku, (this.reserved.get(sku) ?? 0) + 1);
    return true;
  }

  release(sku: string): void {
    this.reserved.set(sku, (this.reserved.get(sku) ?? 0) - 1);
    this.stock.set(sku, (this.stock.get(sku) ?? 0) - 1);
  }
}

@Injectable({ providedIn: 'root' })
export class OrderDesk {
  private readonly warehouse = inject(Warehouse);

  reserve(sku: string): boolean {
    return this.warehouse.reserve(sku);
  }

  ship(sku: string): void {
    this.warehouse.release(sku);
  }
}
