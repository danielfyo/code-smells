# Too Many Related useState

> **ID:** CS152 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

A component with many independent `useState` hooks that actually represent one concept and must change together
(`isLoading`, `isError`, `errorMessage`, `data`, `isSuccess`...). Every transition requires several coordinated `setX`
calls and it is easy to leave the state in an impossible combination.

## Symptoms

- Five, ten or more `useState` calls in a row.
- Handlers that call three or four setters in sequence.
- Contradictory combinations are possible: `isLoading && isError`, `data` alongside `errorMessage`.
- "Reset" logic that resets a dozen states by hand.

## Common causes

- Adding one `useState` per new need without rethinking the model.
- Unfamiliarity with `useReducer` or discriminated unions.

## Why it is a problem

- **Representable impossible states** and bugs when a setter is forgotten.
- **Scattered transition logic** across handlers and effects.
- Hard to test: state logic cannot be tested without rendering.

## How it works under the hood

Each `useState` is an independent cell; React batches updates from the same event into one render, but it does not
know those cells are related or prevent invalid combinations. `useReducer` centralises transitions in a pure function
`(state, action) => newState`, so each action produces a complete, consistent state. If the state is also a
**discriminated union**, TypeScript guarantees that only valid combinations exist (for instance, `message` only exists
when `status === 'error'`).

## Example (smelly)

```tsx
function PaymentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptId, setReceiptId] = useState<string | null>(null);   // SMELL: 5 coupled states

  async function submit(card: Card) {
    setIsSubmitting(true); setIsError(false); setErrorMessage('');
    try {
      const r = await pay(card);
      setReceiptId(r.id); setIsSuccess(true);
    } catch (e) {
      setIsError(true); setErrorMessage(String(e));                  // oops: isSuccess may stay true
    } finally { setIsSubmitting(false); }
  }
  // …
}
```

## Solution (refactored)

```tsx
// REFACTOR: Replace related useState with useReducer + discriminated union
type PaymentState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; receiptId: string }
  | { status: 'error'; message: string };

type Action = { type: 'submit' } | { type: 'succeeded'; receiptId: string } | { type: 'failed'; message: string };

function paymentReducer(_: PaymentState, a: Action): PaymentState {
  switch (a.type) {
    case 'submit':    return { status: 'submitting' };
    case 'succeeded': return { status: 'success', receiptId: a.receiptId };
    case 'failed':    return { status: 'error', message: a.message };
  }
}

function PaymentForm() {
  const [state, dispatch] = useReducer(paymentReducer, { status: 'idle' });
  async function submit(card: Card) {
    dispatch({ type: 'submit' });
    try { dispatch({ type: 'succeeded', receiptId: (await pay(card)).id }); }
    catch (e) { dispatch({ type: 'failed', message: String(e) }); }
  }
  // …
}
```

## Recommended refactorings

- **`useReducer`** with a pure reducer that can be tested in isolation.
- **Group into an object** (`useState<FormValues>`) fields that always change together.
- **Discriminated union** for mutually exclusive states.
- **Remove derivable state** (see [Derived State via useEffect](./derived-state-in-effect.md)).
- **Extract a hook** (`usePayment`) if the logic grows.

## When it may be acceptable

- Several genuinely independent `useState` hooks (a search input and a view toggle) are perfectly idiomatic.

## Related smells

- [Status Variable](../06-data/status-variable.md)
- [Data Clumps](../01-bloaters/data-clumps.md)
- [Boolean Props Explosion](./boolean-prop-explosion.md)
- [God Component](./god-component.md)
- [Nested Ternaries in JSX](./nested-ternaries-jsx.md)

## Automatic detection

- No standard rule limits the number of `useState` calls; `max-statements` or complexity metrics give an indirect signal.
- `@typescript-eslint/switch-exhaustiveness-check` for the resulting reducer.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/useState-explosion/`](../../../react-ts/src/smells/react_ts_specific/useState-explosion/)

## References

- React — *Choosing the State Structure*: https://react.dev/learn/choosing-the-state-structure
- React — *Extracting State Logic into a Reducer*: https://react.dev/learn/extracting-state-logic-into-a-reducer
- React — `useReducer`: https://react.dev/reference/react/useReducer
