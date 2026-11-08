export interface Line {
  product: string;
  net: number;
  qty: number;
}

// REFACTOR: Move Function / Combine Functions into Module. All knowledge about
// taxes and currency format lives in a single `pricing` module. A conceptual
// change (new VAT rate, new format) is now a change in a single place.
export const pricing = {
  vatRate: 0.21,
  net: (lines: Line[]): number => lines.reduce((sum, l) => sum + l.net * l.qty, 0),
  gross(netAmount: number): number {
    return netAmount * (1 + this.vatRate);
  },
  vat(netAmount: number): number {
    return netAmount * this.vatRate;
  },
  format: (amount: number): string => `${amount.toFixed(2)} €`,
  vatLabel(): string {
    return `${Math.round(this.vatRate * 100)}%`;
  },
};

export function CartLine({ line }: { line: Line }) {
  return (
    <li>
      {line.product}: {pricing.format(pricing.gross(line.net * line.qty))}
    </li>
  );
}

export function CartTotal({ lines }: { lines: Line[] }) {
  return <p>Total: {pricing.format(pricing.gross(pricing.net(lines)))}</p>;
}

export function TaxNote({ lines }: { lines: Line[] }) {
  return (
    <small>
      VAT included ({pricing.vatLabel()}): {pricing.format(pricing.vat(pricing.net(lines)))}
    </small>
  );
}

export function Cart({ lines }: { lines: Line[] }) {
  return (
    <div>
      <ul>
        {lines.map((l) => (
          <CartLine key={l.product} line={l} />
        ))}
      </ul>
      <CartTotal lines={lines} />
      <TaxNote lines={lines} />
    </div>
  );
}
