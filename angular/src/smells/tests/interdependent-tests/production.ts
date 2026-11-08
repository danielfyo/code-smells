import { Injectable } from '@angular/core';

// Production code: warehouse stock levels.
@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly stock = new Map<string, number>();

  receive(sku: string, units: number): void {
    this.stock.set(sku, this.unitsOf(sku) + units);
  }

  ship(sku: string, units: number): void {
    const available = this.unitsOf(sku);
    if (units > available) throw new Error(`Only ${available} units of ${sku} left`);
    this.stock.set(sku, available - units);
  }

  unitsOf(sku: string): number {
    return this.stock.get(sku) ?? 0;
  }
}
