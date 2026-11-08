# Prop Drilling

> **ID:** CS133 · **Category:** React + TS-specific · **Sources:** Ferreira 2022 (React smells)

## Definition

Prop drilling means passing a prop through several layers of intermediate components that never use it: they only
receive it and forward it until it reaches the component that actually needs it. Passing props is React's normal
mechanism; the smell appears when the chain is long and the intermediate components become mere "pipes".

## Symptoms

- Components whose props include values they never read and only forward to a child (`user`, `onLogout`, `theme`...).
- Adding a new piece of data to a leaf component forces signature changes in three, four or more components.
- Intermediate props interfaces that keep growing and repeat the same fields.
- Renaming a prop requires touching files that have no functional relationship with it.

## Common causes

- State is "lifted up" to a distant ancestor and then has to be passed all the way down again.
- Unfamiliarity with composition (`children`, slots) or with Context.
- Incremental growth: the tree started with two levels and kept gaining layers.

## Why it is a problem

- **Coupling**: intermediate components depend on types that are none of their business; a change in the leaf ripples upwards.
- **Noise**: signatures hide what each component really needs.
- **Re-renders**: every intermediate re-renders when the prop it merely carries changes.
- **Poor reuse**: an intermediate cannot be used elsewhere without being fed unrelated data.

## How it works under the hood

In React, data flows from parents to children through props; there is no other implicit channel except Context. When
a component's state changes, React re-runs that component and, by default, all of its descendants, which is why every
level of the chain re-renders even if it ignores the data. Context lets a descendant read a value from the nearest
provider without intermediates receiving it. **Composition** (passing already-built JSX as `children`) achieves the
same without Context, because the leaf element is created in the ancestor that already owns the data.

## Example (smelly)

```tsx
type User = { name: string; avatarUrl: string };

function Dashboard({ user }: { user: User }) {
  return <Layout user={user} />;            // SMELL: Dashboard does not use user
}
function Layout({ user }: { user: User }) {
  return <Header user={user} />;            // SMELL: neither does Layout
}
function Header({ user }: { user: User }) {
  return <UserMenu user={user} />;          // SMELL: nor Header
}
function UserMenu({ user }: { user: User }) {
  return <img src={user.avatarUrl} alt={user.name} />;
}
```

## Solution (refactored)

```tsx
// REFACTOR: composition; the ancestor that owns the data creates the leaf
function Dashboard({ user }: { user: User }) {
  return <Layout header={<Header menu={<UserMenu user={user} />} />} />;
}
function Layout({ header }: { header: React.ReactNode }) {
  return <div className="layout">{header}</div>;
}
function Header({ menu }: { menu: React.ReactNode }) {
  return <header>{menu}</header>;
}
// Alternative when the data is truly global (session, theme, locale):
// const UserContext = createContext<User | null>(null) + a useUser() hook.
```

## Recommended refactorings

- **Composition with `children` or `ReactNode` props** (first choice, no Context cost).
- **Introduce Context** for truly cross-cutting data, wrapped in a hook (`useUser()`).
- **Colocate state** closer to where it is used if only one branch needs it.
- **A state library** (Zustand, Redux, TanStack Query for server data) when state is global and complex.

## When it may be acceptable

- Two or three levels of explicit passing are often clearer than any alternative: the data flow is visible.
- Generic presentational components in a design system, where explicit props are the contract.

## Related smells

- [Monolithic / Overused Context](./context-overuse.md) — the cure misapplied.
- [God Component](./god-component.md)
- [Middle Man](../05-couplers/middle-man.md)
- [Long Parameter List](../01-bloaters/long-parameter-list.md)
- [Message Chains](../05-couplers/message-chains.md)

## Automatic detection

- There is no standard ESLint rule for prop drilling. TypeScript's `noUnusedParameters` does not catch it either,
  because forwarding the prop counts as "using" it.
- Code review: look for props that only appear in a child's JSX under the same name.
- React DevTools lets you inspect the props at every level of the tree.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/prop-drilling/`](../../../react-ts/src/smells/react_ts_specific/prop-drilling/)

## References

- React — *Passing Data Deeply with Context*: https://react.dev/learn/passing-data-deeply-with-context
- React — *Thinking in React*: https://react.dev/learn/thinking-in-react
- Kent C. Dodds — *Prop Drilling*: https://kentcdodds.com/blog/prop-drilling
- Ferreira, F.; Valente, M. T. — *Detecting code smells in React-based Web apps* (2022).
