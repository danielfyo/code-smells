// REFACTOR: data access lives in its own module. The query is a constant template with
// positional parameters: the value is never concatenated into the SQL.
export interface ParameterizedQuery {
  text: string;
  values: readonly string[];
}

const PRODUCTS_BY_CATEGORY_SQL = "SELECT id, name, price FROM products WHERE category = $1 ORDER BY name";

export function buildProductQuery(category: string): ParameterizedQuery {
  return { text: PRODUCTS_BY_CATEGORY_SQL, values: [category] };
}
