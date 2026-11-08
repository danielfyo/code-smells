import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CatalogImportService } from './production';

// REFACTOR: In-line Resource / fresh fixture. Each test builds the minimum data it needs, right
// where it is used, so the expected values can be checked by eye.
describe('CatalogImportService (refactored)', () => {
  let service: CatalogImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(CatalogImportService);
  });

  it('parses one item per data row, skipping the header', () => {
    const csv = 'sku;name;price;stock\nA-001;Desk lamp;25;4\nB-104;Notebook;3;100\n';
    expect(service.parse(csv)).toEqual([
      { sku: 'A-001', name: 'Desk lamp', price: 25, stock: 4 },
      { sku: 'B-104', name: 'Notebook', price: 3, stock: 100 },
    ]);
  });

  it('values the stock as price times units, ignoring items out of stock', () => {
    const items = [
      { sku: 'A-001', name: 'Desk lamp', price: 25, stock: 4 }, // 100
      { sku: 'A-003', name: 'Monitor arm', price: 45, stock: 0 }, // 0
    ];
    expect(service.stockValue(items)).toBe(100);
  });
});
