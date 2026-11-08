import { Product } from './refactored';

// REFACTOR: the e-mail markup is generated with the DOM API in a dedicated module, so text is
// escaped automatically and styling can move to the e-mail template system later.
export function shareEmailBody(category: string, products: readonly Product[]): string {
  const root = document.createElement('div');
  const title = document.createElement('h1');
  title.textContent = category;
  const list = document.createElement('ul');
  for (const product of products) {
    const item = document.createElement('li');
    item.textContent = `${product.name} - ${product.price} EUR`;
    list.append(item);
  }
  root.append(title, list);
  return root.outerHTML;
}
