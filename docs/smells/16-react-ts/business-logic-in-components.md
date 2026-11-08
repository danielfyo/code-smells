# Business Logic in Components

> **ID:** CS153 · **Category:** React + TS-specific · **Sources:** React community

## Definition

Business rules — price calculations, discounts, taxes, validation, eligibility — written inside component bodies or
even inline in the JSX, instead of in pure functions or reusable hooks. UI and domain become entangled.

## Symptoms

- Business formulas and conditions inside the `return` (`{total > 100 && user.tier === 'gold' ? …}`).
- The same rule repeated in several components with small variations.
- Testing a calculation requires rendering the component and reading the DOM.
- Business constants (VAT, thresholds) scattered across `.tsx` files.

## Common causes

- Starting from the UI and adding rules wherever they are needed.
- No domain layer in the frontend.
- Haste: "it's just one line".

## Why it is a problem

- **Duplication** and inconsistencies (the cart and checkout compute the total differently).
- **Slow, brittle tests** that depend on the DOM to check arithmetic.
- **Shotgun surgery**: changing a rule means touching several components.
- The logic cannot be reused elsewhere (server, CLI, another framework).

## How it works under the hood

A React component should be a **pure** function of its props and state: same inputs, same JSX. Business rules are pure
functions too, but at a different level of abstraction. If they live in plain TypeScript modules without React
dependencies, they can be imported from any component, hook or test, and they run in milliseconds without a DOM.
Custom hooks are the place for logic that needs state or effects; pure functions are for calculation; the component
remains a thin presentation layer.

## Example (smelly)

```tsx
function CheckoutSummary({ items, user }: { items: CartItem[]; user: User }) {
  return (
    <div>
      {/* SMELL: business rules inline in the JSX */}
      <p>Subtotal: {items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}</p>
      <p>
        Discount:{' '}
        {user.tier === 'gold' && items.reduce((s, i) => s + i.price * i.qty, 0) > 100
          ? (items.reduce((s, i) => s + i.price * i.qty, 0) * 0.1).toFixed(2)
          : '0.00'}
      </p>
      <p>VAT: {(items.reduce((s, i) => s + i.price * i.qty, 0) * 0.21).toFixed(2)}</p>
    </div>
  );
}
```

## Solution (refactored)

```tsx
// domain/pricing.ts — REFACTOR: Extract Function into a pure, tested module
export const VAT_RATE = 0.21;
export const GOLD_THRESHOLD = 100;
export function priceCart(items: CartItem[], tier: User['tier']) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = tier === 'gold' && subtotal > GOLD_THRESHOLD ? subtotal * 0.1 : 0;
  return { subtotal, discount, vat: subtotal * VAT_RATE };
}

// CheckoutSummary.tsx — presentation only
function CheckoutSummary({ items, user }: { items: CartItem[]; user: User }) {
  const { subtotal, discount, vat } = priceCart(items, user.tier);
  return (
    <div>
      <p>Subtotal: {subtotal.toFixed(2)}</p>
      <p>Discount: {discount.toFixed(2)}</p>
      <p>VAT: {vat.toFixed(2)}</p>
    </div>
  );
}
```

## Recommended refactorings

- **Extract Function** into pure domain modules (`domain/`, `lib/`).
- **Extract Custom Hook** for logic with state or effects (`useCheckout`).
- **Introduce Explaining Variable** and **Replace Magic Number with Named Constant**.
- Unit tests for the pure functions; component tests only for presentation.

## When it may be acceptable

- Purely presentational logic (formatting a date, choosing a CSS class).
- Prototypes or single-use components with trivial rules.

## Related smells

- [God Component](./god-component.md)
- [Misplaced Responsibility](../11-general/misplaced-responsibility.md)
- [Duplicate Code](../04-dispensables/duplicate-code.md)
- [Shotgun Surgery](../03-change-preventers/shotgun-surgery.md)
- [Magic Numbers](../06-data/magic-numbers.md)

## Automatic detection

- No specific rule. Signals: `complexity`, `max-lines-per-function`, `no-magic-numbers` (ESLint core).
- Duplication tools (jscpd, SonarQube) for repeated rules.
- Architecture rules (`eslint-plugin-boundaries`, dependency-cruiser) to enforce layers.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/business-logic-in-components/`](../../../react-ts/src/smells/react_ts_specific/business-logic-in-components/)

## References

- React — *Keeping Components Pure*: https://react.dev/learn/keeping-components-pure
- React — *Reusing Logic with Custom Hooks*: https://react.dev/learn/reusing-logic-with-custom-hooks
- React — *Thinking in React*: https://react.dev/learn/thinking-in-react
