# Monolithic / Overused Context

> **ID:** CS148 · **Category:** React + TS-specific · **Sources:** React community

## Definition

A single giant `Context` (`AppContext`) that holds all application state — user, theme, cart, notifications, filters —
plus its updater functions. Any change to one part re-renders **every** consumer, and all components become coupled to
the same object.

## Symptoms

- A root provider with `value={{ user, theme, cart, filters, setUser, setTheme, … }}`.
- Components that only use `theme` re-render when a product is added to the cart.
- Context used for very local state (a form, a modal).
- Testing a component in isolation requires mounting the whole provider.

## Common causes

- Using Context as a drop-in replacement for a global state library.
- Fixing [prop drilling](./prop-drilling.md) by putting everything into one context.
- Building the `value` object on every provider render.

## Why it is a problem

- **Massive re-renders** and performance problems in large trees.
- **Global coupling**: any component can read and modify any part of the state.
- **Global data** with all its problems (see [Global Data](../05-couplers/global-data.md)).

## How it works under the hood

When a `Provider`'s `value` changes (according to `Object.is`), React re-renders **all** components calling
`useContext` for that context, even if they only use a property that did not change; there is no per-field
subscription. If the provider builds `value={{ … }}` on each render, the reference is always new and every consumer
updates on every provider render. Splitting into small, purpose-specific contexts, separating the state context from
the actions context (`dispatch` functions are stable) and memoising the `value` limit the reach of each change.

## Example (smelly)

```tsx
const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  return (
    // SMELL: everything in one new object on every render
    <AppContext.Provider value={{ user, setUser, theme, setTheme, cart, setCart }}>
      {children}
    </AppContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(AppContext)!; // re-renders when the cart changes
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme}</button>;
}
```

## Solution (refactored)

```tsx
// REFACTOR: one context per responsibility, memoised value and an accessor hook
type ThemeValue = { theme: 'light' | 'dark'; toggle: () => void };
const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const value = useMemo(
    () => ({ theme, toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')) }),
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const v = useContext(ThemeContext);
  if (!v) throw new Error('useTheme requires <ThemeProvider>');
  return v;
}
// CartProvider and SessionProvider live separately; local state stays local.
```

## Recommended refactorings

- **Split the context** by responsibility (session, theme, cart).
- **Separate state and actions** into two contexts (the *reducer + context* pattern).
- **Memoise the provider `value`**.
- **Push state down** to where it is used; reserve Context for truly cross-cutting data.
- For complex global or server state: libraries with selective subscriptions (Zustand, Redux, TanStack Query).

## When it may be acceptable

- Small applications where values rarely change (theme, locale, configuration).
- Read-only contexts set once at startup.

## Related smells

- [Prop Drilling](./prop-drilling.md)
- [Global Data](../05-couplers/global-data.md)
- [God Component](./god-component.md)
- [Premature Memoization](./premature-memoization.md)
- [Mutable Package-level State (Go)](../17-go/package-level-state.md)

## Automatic detection

- **`eslint-plugin-react`: `react/jsx-no-constructed-context-values`** flags objects or functions created on every
  render and passed as a provider `value`.
- React DevTools Profiler ("Why did this render?") to spot context-driven re-renders.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/context-overuse/`](../../../react-ts/src/smells/react_ts_specific/context-overuse/)

## References

- React — *Passing Data Deeply with Context* ("Before you use context"): https://react.dev/learn/passing-data-deeply-with-context
- React — *Scaling Up with Reducer and Context*: https://react.dev/learn/scaling-up-with-reducer-and-context
- React — `useContext` (optimising re-renders when passing objects and functions): https://react.dev/reference/react/useContext
- Kent C. Dodds — *How to use React Context effectively*: https://kentcdodds.com/blog/how-to-use-react-context-effectively
