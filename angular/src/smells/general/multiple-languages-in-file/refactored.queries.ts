// REFACTOR: the SQL lives in its own module, as a parameterized statement. The database driver
// receives the values separately, so the text can be validated and reused and never concatenated.
export interface SqlStatement {
  readonly text: string;
  readonly params: readonly unknown[];
}

export const PRODUCTS_BY_CATEGORY = 'SELECT id, name, price FROM products WHERE category = $1 ORDER BY name';

export function productsByCategory(category: string): SqlStatement {
  return { text: PRODUCTS_BY_CATEGORY, params: [category] };
}
