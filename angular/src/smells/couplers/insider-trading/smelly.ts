import { Injectable, inject } from '@angular/core';

// SMELL: Insider Trading. The two services swap private details behind each other's back:
// the order desk edits the warehouse's stock map, and the warehouse peeks at the desk's pending
// reservations to compute availability. Neither can change its internals without breaking the
// other.
@Injectable({ providedIn: 'root' })
export class WarehouseSmelly {
  stock = new Map<string, number>([
    ['LAMP', 3],
    ['DESK', 1],
  ]);
  orderDesk?: OrderDeskSmelly;

  available(sku: string): number {
    const reserved = this.orderDesk?.pendingReservations.filter((r) => r === sku).length ?? 0;
    return (this.stock.get(sku) ?? 0) - reserved;
  }
}

@Injectable({ providedIn: 'root' })
export class OrderDeskSmelly {
  pendingReservations: string[] = [];
  private readonly warehouse = inject(WarehouseSmelly);

  constructor() {
    this.warehouse.orderDesk = this;
  }

  reserve(sku: string): boolean {
    if (this.warehouse.available(sku) <= 0) return false;
    this.pendingReservations.push(sku);
    return true;
  }

  ship(sku: string): void {
    this.pendingReservations.splice(this.pendingReservations.indexOf(sku), 1);
    this.warehouse.stock.set(sku, (this.warehouse.stock.get(sku) ?? 0) - 1);
  }
}
