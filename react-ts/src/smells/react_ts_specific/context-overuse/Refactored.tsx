import { createContext, memo, useContext, useMemo, useState, type Context, type ReactNode } from "react";

// REFACTOR: Split Context. One context per responsibility (theme, cart) with memoized
// values. Each consumer subscribes only to what it uses: adding to the cart no longer
// re-renders the theme toggle.
interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
interface CartState {
  cartCount: number;
  addToCart: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);
const CartContext = createContext<CartState | null>(null);

function useRequiredContext<T>(context: Context<T | null>, name: string): T {
  const value = useContext(context);
  if (!value) throw new Error(`Missing provider for ${name}`);
  return value;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cartCount, setCartCount] = useState(0);
  const themeValue = useMemo<ThemeState>(
    () => ({ theme, toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")) }),
    [theme],
  );
  const cartValue = useMemo<CartState>(() => ({ cartCount, addToCart: () => setCartCount((c) => c + 1) }), [cartCount]);
  return (
    <ThemeContext.Provider value={themeValue}>
      <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
    </ThemeContext.Provider>
  );
}

// memo prevents re-renders from the parent; the split context prevents re-renders from the cart.
export const ThemeToggle = memo(function ThemeToggle({ onRender }: { onRender?: () => void }) {
  const { theme, toggleTheme } = useRequiredContext(ThemeContext, "theme");
  onRender?.();
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
});

export function CartButton() {
  const { cartCount, addToCart } = useRequiredContext(CartContext, "cart");
  return <button onClick={addToCart}>Cart ({cartCount})</button>;
}
