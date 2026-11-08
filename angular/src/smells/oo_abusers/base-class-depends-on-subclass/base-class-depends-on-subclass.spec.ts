import { CsvSalesExporterSmelly, MarkdownSalesExporterSmelly, SalesExporterSmelly } from './smelly';
import { CsvSalesExporter, MarkdownSalesExporter, SalesExporter, type SalesRow } from './refactored';

const rows: SalesRow[] = [
  { region: 'North', units: 120 },
  { region: 'South', units: 75 },
];

describe('Base Class Depending on Its Derivatives', () => {
  it('both versions export the same CSV and Markdown', () => {
    expect(new CsvSalesExporter().export(rows)).toBe(new CsvSalesExporterSmelly().export(rows));
    expect(new MarkdownSalesExporter().export(rows)).toBe(new MarkdownSalesExporterSmelly().export(rows));
  });

  it('a new smelly subclass fails until the base class is edited', () => {
    class TsvExporter extends SalesExporterSmelly {}
    expect(() => new TsvExporter().export(rows)).toThrow('Unknown exporter');
  });

  it('a new refactored subclass works without touching the base class', () => {
    class TsvExporter extends SalesExporter {
      protected header(): string[] {
        return ['region\tunits'];
      }
      protected formatRow(row: SalesRow): string {
        return `${row.region}\t${row.units}`;
      }
    }
    expect(new TsvExporter().export(rows)).toBe('region\tunits\nNorth\t120\nSouth\t75');
  });
});
