export interface Product {
  id: number;
  name: string;
  price: number;
}

// REFACTOR: external data arrives as unknown and is validated with a type guard
// (Parse, don't validate). Only what passes validation gets the Product type.
function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === "number" && typeof candidate.name === "string" && typeof candidate.price === "number";
}

export async function loadProducts(fetchJson: () => Promise<unknown>): Promise<Product[]> {
  const data = await fetchJson();
  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new TypeError("The API returned products with an unexpected format");
  }
  return data;
}

export function cheapestPrice(products: Product[]): number {
  return Math.min(...products.map((p) => p.price));
}

// REFACTOR: explicit field-by-field conversion instead of a double assertion.
export function toProduct([id, name, price]: [string, string, string]): Product {
  return { id: Number(id), name, price: Number(price) };
}
