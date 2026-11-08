export interface Line {
  product: string;
  net: number;
  qty: number;
}

// SMELL: Shotgun Surgery. VAT (21%) and the currency format are copied into
// every component. Changing the tax rate or switching to "1.234,50 €" means
// editing three different components, and forgetting one is enough to show
// inconsistent amounts on screen.
export function CartLine({ line }: { line: Line }) {
  const gross = line.net * line.qty * 1.21;
  return (
    <li>
      {line.product}: {gross.toFixed(2)} €
    </li>
  );
}

export function CartTotal({ lines }: { lines: Line[] }) {
  const gross = lines.reduce((sum, l) => sum + l.net * l.qty, 0) * 1.21;
  return <p>Total: {gross.toFixed(2)} €</p>;
}

export function TaxNote({ lines }: { lines: Line[] }) {
  const tax = lines.reduce((sum, l) => sum + l.net * l.qty, 0) * 0.21;
  return <small>VAT included (21%): {tax.toFixed(2)} €</small>;
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
