export interface Product {
  name: string;
  price: number;
  stock: number;
  tags: string[];
}

// SMELL: obscured intent. A "clever" one-liner chaining operators, coercions
// (!!, ~, +) and a comma-reduce that nobody understands without taking it apart by hand.
export const summarize = (p: Product[]) =>
  p.reduce((a, x) => (x.stock && ~x.tags.indexOf("sale") && (a.n++, (a.t += +x.price * 0.8)), a), { n: 0, t: 0 });

// SMELL: double negation and boolean arithmetic for a simple "is any stock low?".
export const lowStock = (p: Product[]) => !!p.filter((x) => +(x.stock < 5) & +(x.stock > 0)).length;
