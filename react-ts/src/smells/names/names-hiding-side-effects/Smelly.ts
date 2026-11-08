export interface Cart {
  id: string;
  items: string[];
}

const carts = new Map<string, Cart>();

// SMELL: the name "getCart" suggests a side-effect-free query, but if the cart doesn't
// exist it CREATES and stores it. Anyone calling it "just to look" mutates state.
export function getCart(userId: string): Cart {
  let cart = carts.get(userId);
  if (!cart) {
    cart = { id: `cart-${userId}`, items: [] };
    carts.set(userId, cart);
  }
  return cart;
}

export function cartCount(): number {
  return carts.size;
}

export function resetCarts(): void {
  carts.clear();
}
