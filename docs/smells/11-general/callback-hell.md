# Callback Hell / Pyramid of Doom

> **ID:** CS079 · **Category:** General · **Sources:** Jerzyk 2023

*Callbacks nested inside one another that make asynchronous flow unreadable.*

## Definition

Asynchronous operations chained through callbacks nested inside one another, forming a *Pyramid of Doom*
drifting to the right. Control flow and error handling are scattered across every level. Jerzyk and Madeyski
catalog it as *Callback Hell*; although it originated in JavaScript, it appears in any language with
callback- or continuation-based APIs.

## Symptoms

- Growing indentation with `function(err, result) { ... }` or lambdas nested several levels deep.
- Error checks repeated at every level (`if (err) return cb(err)`).
- Outer-level variables used in inner levels, making it hard to tell where each comes from.
- In C#, nested `ContinueWith`; in Python, callbacks via `add_done_callback`; in Go, nested closures passed as continuations.

## Common causes

- Legacy callback-based APIs.
- Unfamiliarity with promises, `async/await`, tasks or coroutines.
- Adding steps one at a time without restructuring.

## Why it is a problem

- **Unreadability**: the sequential flow does not look sequential.
- **Lost errors** when one level forgets to propagate the error.
- Hard to add steps, parallelize or cancel.

## Example (smelly)

```typescript
function checkout(cartId: string, done: (err: Error | null, receipt?: Receipt) => void) {
  loadCart(cartId, (err, cart) => {
    if (err) return done(err);
    reserveStock(cart!, (err) => {
      if (err) return done(err);
      charge(cart!, (err, payment) => {
        if (err) return done(err);
        sendReceipt(payment!, (err, receipt) => {
          // SMELL: callback pyramid with errors repeated at every level
          done(err, receipt);
        });
      });
    });
  });
}
```

## Solution (refactored)

```typescript
// REFACTOR: async/await flattens the flow and centralizes errors
async function checkout(cartId: string): Promise<Receipt> {
  const cart = await loadCart(cartId);
  await reserveStock(cart);
  const payment = await charge(cart);
  return sendReceipt(payment);
}
```

If the API only offers callbacks, wrap it once (`util.promisify` in Node, `TaskCompletionSource` in C#,
`asyncio.Future` or `loop.run_in_executor` in Python) and let the rest of the code work with promises or tasks.

## Recommended refactorings

- Convert callbacks to **promises / `async`-`await`** (or `Task` in C#, coroutines in Python).
- **Extract Function** for each step, with its own name.
- **Replace Nested Conditional with Guard Clauses** in error handling.
- In Go, write sequential code with goroutines and channels or `errgroup` instead of nested continuations.

## When it may be acceptable

- A single callback level for events (`onClick`, `addEventListener`), which is the natural use.
- Low-level event-oriented APIs where the callback model is right, as long as callbacks are not nested.

## Related smells

- [Deep Nesting / Arrow Code](../07-functions/deep-nesting.md): deep nesting in general.
- [Long Method](../01-bloaters/long-method.md): pyramids are usually long methods.
- [Sync over Async (.Result / .Wait())](../15-csharp/sync-over-async.md): mixing async styles incorrectly in C#.
- [Chains of Effects](../16-react-ts/effect-chains.md): chained effects in React.
- [Swallowed Exceptions / Afraid to Fail](../08-error-handling/swallowed-exceptions.md): errors lost at some level.

## Automatic detection

- **TypeScript**: ESLint `max-nested-callbacks`, `max-depth`; `eslint-plugin-promise` (`promise/no-nesting`, `promise/prefer-await-to-callbacks`, `promise/prefer-await-to-then`).
- **C#**: SonarQube `S3776` (cognitive complexity); review `ContinueWith` versus `await`.
- **Python**: Ruff `C901` and Pylint `R1702` (`too-many-nested-blocks`).
- **Go**: `nestif` and `gocognit` in golangci-lint.

## Implementations

- Python: [`python/code_smells/general/callback_hell/`](../../../python/code_smells/general/callback_hell/)
- C#: [`csharp/src/CodeSmells/General/CallbackHell/`](../../../csharp/src/CodeSmells/General/CallbackHell/)
- React + TS: [`react-ts/src/smells/general/callback-hell/`](../../../react-ts/src/smells/general/callback-hell/)
- Go: [`go/smells/general/callback-hell/`](../../../go/smells/general/callback-hell/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
