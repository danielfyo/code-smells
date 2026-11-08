import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CatalogImportService } from './production';
import { LEGACY_CATALOG_CSV } from './smelly.fixtures';

// SMELL: mystery guest. The input lives in a separate shared resource (a fixture file here; a
// seeded database or a CSV on disk in many projects). Reading the test you cannot tell why the
// expected numbers are 6 and 710, and editing the fixture for another suite breaks this one.
describe('CatalogImportService (smelly)', () => {
  it('imports the catalog', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const service = TestBed.inject(CatalogImportService);
    const items = service.parse(LEGACY_CATALOG_CSV);
    expect(items).toHaveLength(6);
    expect(service.stockValue(items)).toBe(710);
  });
});
