export interface SalesRow {
  region: string;
  units: number;
}

// REFACTOR: Form Template Method / Replace Conditional with Polymorphism. The base class only
// defines the algorithm skeleton; each subclass fills in its own steps. The base no longer
// knows which subclasses exist (Open/Closed Principle).
export abstract class SalesExporter {
  export(rows: readonly SalesRow[]): string {
    return [...this.header(), ...rows.map((row) => this.formatRow(row))].join('\n');
  }

  protected abstract header(): string[];
  protected abstract formatRow(row: SalesRow): string;
}

export class CsvSalesExporter extends SalesExporter {
  protected header(): string[] {
    return ['region,units'];
  }

  protected formatRow({ region, units }: SalesRow): string {
    return `${region},${units}`;
  }
}

export class MarkdownSalesExporter extends SalesExporter {
  protected header(): string[] {
    return ['| region | units |', '|---|---|'];
  }

  protected formatRow({ region, units }: SalesRow): string {
    return `| ${region} | ${units} |`;
  }
}
