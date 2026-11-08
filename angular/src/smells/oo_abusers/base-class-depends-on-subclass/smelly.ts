export interface SalesRow {
  region: string;
  units: number;
}

// SMELL: Base Class Depending on Its Derivatives. The base class checks `instanceof` against its
// own subclasses to decide how to format. Adding an HtmlExporter means editing the base class,
// and the base cannot even be compiled or tested without knowing every child.
export abstract class SalesExporterSmelly {
  export(rows: readonly SalesRow[]): string {
    if (this instanceof CsvSalesExporterSmelly) {
      return ['region,units', ...rows.map((r) => `${r.region},${r.units}`)].join('\n');
    }
    if (this instanceof MarkdownSalesExporterSmelly) {
      return ['| region | units |', '|---|---|', ...rows.map((r) => `| ${r.region} | ${r.units} |`)].join('\n');
    }
    throw new Error('Unknown exporter');
  }
}

export class CsvSalesExporterSmelly extends SalesExporterSmelly {}

export class MarkdownSalesExporterSmelly extends SalesExporterSmelly {}
