// SMELL: Global Data. The cart is a mutable module-level object. Unrelated
// components and functions read and write it; nobody knows who changed it,
// React does not notice the changes and state leaks between tests (and between
// users, when rendering on the server).
import { useReducer } from "react";

export const cartStore = { items: [] as string[], coupon: "" };

export function addToCart(item: string): void {
  cartStore.items.push(item);
}

export function AddButton({ item }: { item: string }) {
  // SMELL: re-render must be forced by hand because React does not see the change.
  const [, forceRender] = useReducer((n: number) => n + 1, 0);
  return (
    <button
      onClick={() => {
        addToCart(item);
        forceRender();
      }}
    >
      Add {item}
    </button>
  );
}

export function CartCounter() {
  return <span aria-label="counter">{cartStore.items.length} items</span>;
}

export function Shop() {
  const [, forceRender] = useReducer((n: number) => n + 1, 0);
  // SMELL: another patch: re-render the whole shop on every click so the
  // counter reads the updated global value.
  return (
    <div onClick={() => forceRender()}>
      <AddButton item="T-shirt" />
      <AddButton item="Cap" />
      <CartCounter />
    </div>
  );
}
