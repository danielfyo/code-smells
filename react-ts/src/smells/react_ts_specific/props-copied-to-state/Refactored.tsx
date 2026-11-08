// REFACTOR: read the prop directly and derive during render. If an "initialized" local
// state were really needed (an editable draft), the prop would be named initialPrice and
// the parent would reset it with a different key.
export function PriceTag({ price, label }: { price: number; label: string }) {
  const title = label.toUpperCase();
  return (
    <p>
      {title}: {price.toFixed(2)} €
    </p>
  );
}
