// SMELL: multiple languages in one file. A single component mixes SQL, HTML in strings
// and CSS in a template, all as strings with no types, highlighting or validation.
export interface Product {
  id: number;
  name: string;
  price: number;
}

export function buildProductQuery(category: string): string {
  // SMELL: embedded SQL built by concatenation (and an injection risk on top).
  return "SELECT id, name, price FROM products WHERE category = '" + category + "' ORDER BY name";
}

// SMELL: CSS inside a TypeScript template string.
const styles = `
  .product-list { list-style: none; padding: 0; }
  .product-list li { color: #333; }
  .price { font-weight: bold; }
`;

export function ProductList({ products }: { products: Product[] }) {
  // SMELL: HTML hand-built in strings and injected with dangerouslySetInnerHTML.
  const html =
    "<ul class='product-list'>" +
    products.map((p) => "<li>" + p.name + " <span class='price'>" + p.price.toFixed(2) + " €</span></li>").join("") +
    "</ul>";
  return (
    <section>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
