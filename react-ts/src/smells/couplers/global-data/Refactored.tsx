// REFACTOR: Encapsulate Variable + Replace Global with Context. State lives in
// a React provider with a reducer: each tree has its own cart, changes trigger
// re-renders automatically and state is only modified through explicit actions.
import { createContext, useContext, useReducer, type ReactNode } from "react";

interface CartState {
  items: string[];
}

type CartAction = { type: "add"; item: string };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add":
      return { items: [...state.items, action.item] };
  }
}

interface CartContextValue {
  items: readonly string[];
  add: (item: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const value: CartContextValue = { items: state.items, add: (item) => dispatch({ type: "add", item }) };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function AddButton({ item }: { item: string }) {
  const { add } = useCart();
  return <button onClick={() => add(item)}>Add {item}</button>;
}

export function CartCounter() {
  const { items } = useCart();
  return <span aria-label="counter">{items.length} items</span>;
}

export function Shop() {
  return (
    <CartProvider>
      <AddButton item="T-shirt" />
      <AddButton item="Cap" />
      <CartCounter />
    </CartProvider>
  );
}
