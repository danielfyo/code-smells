# Side Effects

> **ID:** CS040 · **Category:** Functions & Conditional Logic · **Sources:** Clean Code; Jerzyk 2023
>
> A function promises one thing but also changes global state, its arguments or the system without warning.

## Definition

A function has **hidden side effects** when, beyond what its name promises, it modifies global state,
object attributes, its arguments or the system (files, network, database) without anything in its
signature announcing it. *Clean Code* illustrates this with a `checkPassword()` that, besides checking
the password, initializes the session: whoever only wants to verify credentials will wipe the user's
session without knowing it.

Side effects are not bad in themselves (a program without them does nothing useful); the smell is that
they are **hidden** or mixed with calculations that should be pure.

## Symptoms

- Functions with query-like names (`get`, `is`, `check`, `calculate`) that write state.
- Calling the same function twice yields different results.
- Tests that need to restore global state after each run.
- Calculation functions that also log, save or send something.

## Common causes

- Adding an action "while we're at it" to an existing function.
- Lazy initialization or caches implemented without encapsulation.
- No separation between domain logic and infrastructure.

## Why it is a problem

- Surprising behavior that causes hard-to-trace bugs.
- Temporal coupling: the order of calls starts to matter.
- Functions that cannot be reused or tested in isolation.

## Example (smelly)

```go
var lastValidated string

// SMELL: the name promises a check, but it also modifies state
func IsValidCoupon(code string, cart *Cart) bool {
	ok := strings.HasPrefix(code, "PROMO") && len(code) == 9
	if ok {
		lastValidated = code
		cart.Discount = 0.1
	}
	return ok
}
```

## Solution (refactored)

```go
// REFACTOR: pure query
func IsValidCoupon(code string) bool {
	return strings.HasPrefix(code, "PROMO") && len(code) == 9
}

// REFACTOR: explicit command with the effect in its name
func (c *Cart) ApplyCoupon(code string) error {
	if !IsValidCoupon(code) {
		return ErrInvalidCoupon
	}
	c.Discount = couponDiscount
	return nil
}
```

## Recommended refactorings

- **Separate Query from Modifier**: splits the function into a pure query and an explicit command.
- **Change Function Declaration**: renames the function so its name announces the effect.
- **Encapsulate Variable**: controls and makes visible the writes to shared state.
- **Split Phase**: separates the pure computation from the part that interacts with the outside world (functional core, imperative shell).

## When it may be acceptable

- Effects made explicit in the name and signature (`save()`, `send_email()`, `ApplyCoupon()`).
- Transparent caches and memoization that do not change the observable result.
- Logging and metrics, as long as they do not influence the logic.

## Related smells

- [Command-Query Separation Violation](command-query-violation.md) — the special case of functions that both query and modify.
- [Names Should Describe Side-Effects](../10-names/names-hiding-side-effects.md) — names that hide what the function does.
- [Global Data](../05-couplers/global-data.md) — global state is the usual target of hidden effects.
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md) — side effects impose call orderings.
- [Output Arguments](output-arguments.md) — modifying arguments is a side effect.
- [Side Effects in LINQ](../15-csharp/linq-side-effects.md) — C# variant.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0603 global-statement` and Ruff `PLW0603` detect global writes; Ruff `B006` for mutable default values. |
| C# | SonarQube `S2696` (instance methods writing static fields); the `[Pure]` attribute and analyzers that warn when a return value is ignored (`CA1806`). |
| React + TS | ESLint `no-param-reassign`, `no-global-assign`; in React, Strict Mode (`<StrictMode>`) double-invokes renders and effects in development to expose impure ones. |
| Go | golangci-lint `gochecknoglobals`; revive `modifies-parameter`; `go test -race` for concurrent effects. |

No linter can know what a function's name promises; detecting hidden effects is mostly a job for review and tests.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/functions/side_effects/`](../../../python/code_smells/functions/side_effects/) |
| C# | [`csharp/src/CodeSmells/Functions/SideEffects/`](../../../csharp/src/CodeSmells/Functions/SideEffects/) |
| React + TS | [`react-ts/src/smells/functions/side-effects/`](../../../react-ts/src/smells/functions/side-effects/) |
| Go | [`go/smells/functions/side-effects/`](../../../go/smells/functions/side-effects/) |
| Angular | [`angular/src/smells/functions/side-effects/`](../../../angular/src/smells/functions/side-effects/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
