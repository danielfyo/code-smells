# Indiscriminate Props Spreading

> **ID:** CS154 · **Category:** React + TS-specific · **Sources:** eslint-plugin-react jsx-props-no-spreading

## Definition

Forwarding all received props with `{...props}` to a child or DOM element without choosing which ones. The component's
contract becomes invisible: you cannot tell what it accepts or what reaches the target, and unknown attributes end up
in the DOM or overwrite props that were set explicitly.

## Symptoms

- `function Card(props: any) { return <div {...props} /> }`.
- React warnings such as "React does not recognize the `isActive` prop on a DOM element".
- Internal props (`variant`, `onSave`) showing up as HTML attributes.
- Spread order silently overriding values (`<input type="email" {...props} />`).

## Common causes

- Convenience when wrapping components.
- Loosely defined props types (`any`, `Record<string, unknown>`).
- Container components passing "everything they get" just in case.

## Why it is a problem

- **Hidden contract**: reading the component does not reveal which props it uses.
- **Invalid attributes** in the DOM and console warnings; possible data leaks into the HTML.
- **Silent overrides** depending on spread order.
- Re-renders and coupling: any new prop travels down the whole chain.

## How it works under the hood

`<div {...props} />` compiles to `jsx('div', { ...props })`: every key is copied and, as with any JavaScript object
literal, the last one wins. React turns props of native elements into DOM attributes; those it does not recognise are
warned about or written as-is. In TypeScript, structural typing allows objects with extra properties to flow through
variables without an "excess property" error, so the compiler does not protect you either. The alternative is to
destructure the component's own props and forward only a `...rest` whose type is restricted to the target element's
attributes (`React.ComponentPropsWithoutRef<'button'>`).

## Example (smelly)

```tsx
function PrimaryButton(props: any) {                          // SMELL: unknown contract
  return <button className="btn-primary" {...props} />;       // SMELL: everything to the DOM; className overridden
}

function SaveToolbar(props: any) {
  return <PrimaryButton {...props}>Save</PrimaryButton>;      // SMELL: blind forwarding
}

// <SaveToolbar variant="danger" onSave={save} isDirty />  → invalid attributes on <button>
```

## Solution (refactored)

```tsx
// REFACTOR: explicit props + rest typed to the target element
type PrimaryButtonProps = React.ComponentPropsWithoutRef<'button'> & { loading?: boolean };

function PrimaryButton({ loading = false, className, children, ...rest }: PrimaryButtonProps) {
  return (
    <button {...rest} className={`btn-primary ${className ?? ''}`} disabled={loading || rest.disabled}>
      {loading ? 'Saving…' : children}
    </button>
  );
}

function SaveToolbar({ onSave, isDirty }: { onSave: () => void; isDirty: boolean }) {
  return <PrimaryButton onClick={onSave} disabled={!isDirty}>Save</PrimaryButton>;
}
```

## Recommended refactorings

- **Declare props explicitly** and pass them by name.
- **Destructure your own props** and forward a `...rest` typed with `ComponentPropsWithoutRef<'element'>`.
- Place the spread **before** props that must not be overridable.
- For polymorphic components, use patterns such as `asChild`/slots from UI libraries.

## When it may be acceptable

- Wrapper components around a native element (a design-system `Input`) that forward HTML attributes with a
  restricted type.
- Higher-order components whose purpose is precisely to pass props through, with correct generic types.

## Related smells

- [any Abuse](./any-type.md)
- [Prop Drilling](./prop-drilling.md)
- [Too Much Information](../11-general/too-much-information.md)
- [Inappropriate Intimacy](../05-couplers/inappropriate-intimacy.md)

## Automatic detection

- **`eslint-plugin-react`: `react/jsx-props-no-spreading`** (configurable to allow spreading on HTML elements or
  specific components).
- **`@typescript-eslint/no-explicit-any`** for the props type.
- React warns in the console about unknown attributes on DOM elements.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/props-spreading/`](../../../react-ts/src/smells/react_ts_specific/props-spreading/)

## References

- React — *Passing Props to a Component* (forwarding props with the JSX spread syntax): https://react.dev/learn/passing-props-to-a-component
- eslint-plugin-react — `jsx-props-no-spreading`: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
- TypeScript Handbook — *Type Compatibility*: https://www.typescriptlang.org/docs/handbook/type-compatibility.html
