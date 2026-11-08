import { createContext, useContext, useState, type ReactNode } from "react";

// SMELL: monolithic context. User, theme and cart live in a single context with a new
// object on every render. Any change (adding to the cart) re-renders ALL consumers,
// including the theme toggle, which doesn't use the cart.
interface AppState {
  userName: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
  cartCount: number;
  addToCart: () => void;
}

const AppContext = createContext<AppState | null>(null);

function useApp(): AppState {
  const value = useContext(AppContext);
  if (!value) throw new Error("AppProvider is missing");
  return value;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cartCount, setCartCount] = useState(0);
  const value: AppState = {
    userName: "Anna",
    theme,
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    cartCount,
    addToCart: () => setCartCount((c) => c + 1),
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function ThemeToggle({ onRender }: { onRender?: () => void }) {
  const { theme, toggleTheme } = useApp();
  onRender?.();
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
}

export function CartButton() {
  const { cartCount, addToCart } = useApp();
  return <button onClick={addToCart}>Cart ({cartCount})</button>;
}
