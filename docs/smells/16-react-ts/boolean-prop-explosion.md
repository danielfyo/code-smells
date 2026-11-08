# Boolean Props Explosion

> **ID:** CS145 · **Category:** React + TS-specific · **Sources:** React community

## Definition

A component configured through many independent boolean props (`isPrimary`, `isDanger`, `isSecondary`, `isSmall`,
`isLarge`...). The number of combinations grows as 2ⁿ and many are impossible or contradictory (`isPrimary` and
`isDanger` at once), yet the type allows them.

## Symptoms

- Mutually exclusive boolean props in the same interface.
- Chains of `if (isPrimary) … else if (isDanger) …` with an implicit priority order.
- Usages such as `<Button isPrimary isDanger isSmall isLarge />` that compile without errors.
- Documentation like "do not combine `isLarge` with `isSmall`".

## Common causes

- Adding one new prop per requested variant without revisiting the design.
- Unfamiliarity with literal unions and discriminated unions in TypeScript.

## Why it is a problem

- **Representable impossible states**: the type admits nonsensical configurations.
- **Hidden priority logic**: which one wins when two are passed is an implicit decision.
- **Combinatorics**: testing every combination is not feasible.
- APIs that are hard to discover and maintain.

## How it works under the hood

In TypeScript, `{ isPrimary?: boolean; isDanger?: boolean }` is a product type: its set of values is the Cartesian
product of the options. A **union of literals** (`variant: 'primary' | 'danger' | 'secondary'`) is a sum type: exactly
one option at a time. For variants carrying data, **discriminated unions** use a shared literal field (`kind`) that
lets the compiler narrow the type in a `switch` and check exhaustiveness with `never`.

## Example (smelly)

```tsx
type ButtonProps = {
  isPrimary?: boolean; isSecondary?: boolean; isDanger?: boolean;   // SMELL
  isSmall?: boolean; isLarge?: boolean;                              // SMELL
  children: React.ReactNode;
};

function Button({ isPrimary, isSecondary, isDanger, isSmall, isLarge, children }: ButtonProps) {
  let cls = 'btn';
  if (isDanger) cls += ' btn-danger';           // implicit priority
  else if (isPrimary) cls += ' btn-primary';
  else if (isSecondary) cls += ' btn-secondary';
  if (isSmall) cls += ' btn-sm';
  if (isLarge) cls += ' btn-lg';                 // sm and lg at the same time
  return <button className={cls}>{children}</button>;
}
```

## Solution (refactored)

```tsx
// REFACTOR: Replace Boolean Flags with Union Type
type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = { variant?: Variant; size?: Size; children: React.ReactNode };

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary', secondary: 'btn-secondary', danger: 'btn-danger',
};

function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  return <button className={`btn ${variantClass[variant]} btn-${size}`}>{children}</button>;
}
// <Button variant="danger" size="sm">Delete</Button>
```

## Recommended refactorings

- **Replace booleans with a union of literals** (`variant`, `size`, `status`).
- **Discriminated unions** when each variant requires different props.
- **Composition** (`<Button.Icon />`, slots) instead of flags like `hasIcon`, `hasBadge`.
- `Record<Variant, ...>` maps so adding a variant forces every case to be filled in.

## When it may be acceptable

- Truly independent, orthogonal booleans (`disabled`, `fullWidth`, `loading`).
- Props mirroring native HTML boolean attributes.

## Related smells

- [Flag Arguments](../07-functions/flag-arguments.md)
- [Boolean Blindness](../06-data/boolean-blindness.md)
- [Combinatorial Explosion](../03-change-preventers/combinatorial-explosion.md)
- [Stringly Typed Code](./stringly-typed.md)
- [Nested Ternaries in JSX](./nested-ternaries-jsx.md)

## Automatic detection

- No standard rule counts boolean props. `@typescript-eslint/switch-exhaustiveness-check` helps once migrated to unions.
- `eslint-plugin-react`: `boolean-prop-naming` enforces names, not quantity.
- Design review in Storybook: control combinations that make no visual sense.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/boolean-prop-explosion/`](../../../react-ts/src/smells/react_ts_specific/boolean-prop-explosion/)

## References

- TypeScript Handbook — *Narrowing* (discriminated unions, exhaustiveness checking): https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- TypeScript Handbook — *Everyday Types* (literal types, union types): https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- React — *Choosing the State Structure* ("Avoid contradictions in state"): https://react.dev/learn/choosing-the-state-structure
