export interface Cart {
  id: string;
  items: string[];
}

const carts = new Map<string, Cart>();

// REFACTOR: the pure query is split from the command (Separate Query from Modifier)
// and the command's name admits its side effect.
export function findCart(userId: string): Cart | undefined {
  return carts.get(userId);
}

export function getOrCreateCart(userId: string): Cart {
  const existing = carts.get(userId);
  if (existing) return existing;
  const created: Cart = { id: `cart-${userId}`, items: [] };
  carts.set(userId, created);
  return created;
}

export function cartCount(): number {
  return carts.size;
}

export function resetCarts(): void {
  carts.clear();
}
