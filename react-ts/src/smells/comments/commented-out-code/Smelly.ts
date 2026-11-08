export interface Product {
  name: string;
  price: number;
  stock: number;
}

export function availableProducts(products: Product[]): Product[] {
  // SMELL: commented-out code. Nobody knows whether it matters, whether it works or why it
  // was removed, so nobody dares to delete it and it clutters the file forever.
  // const filtered = [];
  // for (let i = 0; i < products.length; i++) {
  //   if (products[i].stock > 0 && products[i].price > 0) {
  //     filtered.push(products[i]);
  //   }
  // }
  // return filtered;
  return products
    .filter((p) => p.stock > 0)
    // .filter((p) => p.price > 0) // SMELL: disabled on purpose or by mistake?
    .sort((a, b) => a.name.localeCompare(b.name));
  // console.log("products", products);
}

// SMELL: a whole function commented out "just in case".
// export function legacyDiscount(p: Product) {
//   return p.price * 0.85;
// }
