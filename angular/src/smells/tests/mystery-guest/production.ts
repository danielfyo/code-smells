import { Injectable } from '@angular/core';

// Production code: imports a product catalog from CSV ("sku;name;price;stock").
export interface CatalogItem {
  sku: string;
  name: string;
  price: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class CatalogImportService {
  parse(csv: string): CatalogItem[] {
    return csv
      .trim()
      .split('\n')
      .slice(1)
      .map((row) => {
        const [sku = '', name = '', price = '0', stock = '0'] = row.split(';');
        return { sku, name, price: Number(price), stock: Number(stock) };
      });
  }

  stockValue(items: readonly CatalogItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.stock, 0);
  }
}
