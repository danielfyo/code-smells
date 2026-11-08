# Exceptions for Control Flow

> **ID:** CS048 · **Category:** Error Handling · **Sources:** Bloch; Microsoft Guidelines

*Using exceptions for expected cases of the normal flow instead of conditions.*

## Definition

Exceptions are thrown and caught to handle **expected** situations of the normal flow: a key missing from a
dictionary, a user that does not exist, the end of an iteration, a form validation. The exception acts as a
non-local `goto`. Joshua Bloch (*Effective Java*, Item 69) and the .NET design guidelines agree: exceptions
are for exceptional conditions, not for choosing which branch to run.

## Symptoms

- `try` blocks whose `catch` holds the main business logic rather than recovery from a failure.
- `throw` followed by `catch` in the same function or the one immediately above.
- Loops that end by catching an exception (`IndexError`, `NoSuchElement`) instead of checking the condition.
- Custom exceptions named after normal outcomes (`UserFoundException`, `DiscountAppliedError`).
- Profiles where the cost of capturing stack traces is significant.

## Common causes

- Lack of a query API (`TryGet`, `exists`, a `find` that returns an optional).
- Misreading Python's EAFP style as a license for any exception-driven flow.
- Shortcuts to escape several levels of nesting.

## Why it is a problem

- **Hard-to-follow flow**: readers cannot tell where execution may jump from.
- **Performance**: throwing exceptions (with stack capture) is far more expensive than a check, especially in C# and Java.
- **Real errors masked**: a broad `catch` meant for the expected case also traps genuine failures.
- Debuggers configured to break on exceptions become useless because of the noise.

## Example (smelly)

```csharp
public decimal PriceFor(string sku)
{
    try
    {
        // SMELL: a product without an offer is normal, not exceptional
        return _offers[sku].DiscountedPrice;
    }
    catch (KeyNotFoundException)
    {
        return _catalog.BasePrice(sku);
    }
}
```

## Solution (refactored)

```csharp
public decimal PriceFor(string sku)
{
    // REFACTOR: Replace Exception with Precheck through the Try* API
    return _offers.TryGetValue(sku, out var offer)
        ? offer.DiscountedPrice
        : _catalog.BasePrice(sku);
}
```

In Python, `offers.get(sku)` or `if sku in offers` plays the same role; in TypeScript, `map.get(sku) ?? ...`;
in Go, the `offer, ok := offers[sku]` form. Exceptions remain for real failures (catalog unavailable).

## Recommended refactorings

- **Replace Exception with Precheck**.
- **Introduce Special Case** (or a null object) for the missing value.
- Provide **`TryXxx` / optional APIs** (`TryParse`, a `find` returning `Optional`, `(value, ok)` in Go).
- **Decompose Conditional** when the `catch` was hiding several business branches.

## When it may be acceptable

- Python's EAFP style: `try: value = cache[key] except KeyError:` is idiomatic and efficient when absence is rare or when checking first would cause a race condition (files, shared resources).
- `StopIteration` in Python's iterator protocol: part of the language, though it rarely needs manual handling.
- When checking the condition is as expensive or as unreliable as trying (e.g. "does the file exist?" before opening it).

## Related smells

- [panic for Control Flow](../17-go/panic-for-control-flow.md): the Go equivalent with `panic`/`recover`.
- [Swallowed Exceptions / Afraid to Fail](swallowed-exceptions.md): control-flow `catch` blocks often swallow real errors too.
- [Returning Error Codes](error-codes.md): the opposite end of the spectrum.
- [Deep Nesting / Arrow Code](../07-functions/deep-nesting.md): exceptions are sometimes used to escape nesting.

## Automatic detection

- **C#**: SonarQube flags catching general exceptions and `NullReferenceException`; profilers and *exceptions thrown/sec* counters reveal the pattern at run time.
- **Python**: Ruff's `TRY` rules (tryceratops), e.g. `TRY300` (try-consider-else) and `TRY203` (useless try-except), help review badly structured `try` blocks.
- **TypeScript**: no direct rule; review `throw` statements caught in the same function (ESLint `no-useless-catch` covers the trivial case).
- **Go**: review uses of `recover()` outside goroutine or server boundaries; `gocritic` and `revive` help locate `panic` in library code.

Detection is mostly manual: the key question is whether the caught situation is part of the expected flow.

## Implementations

- Python: [`python/code_smells/error_handling/exceptions_for_control_flow/`](../../../python/code_smells/error_handling/exceptions_for_control_flow/)
- C#: [`csharp/src/CodeSmells/ErrorHandling/ExceptionsForControlFlow/`](../../../csharp/src/CodeSmells/ErrorHandling/ExceptionsForControlFlow/)
- React + TS: [`react-ts/src/smells/error_handling/exceptions-for-control-flow/`](../../../react-ts/src/smells/error_handling/exceptions-for-control-flow/)
- Go: [`go/smells/error_handling/exceptions-for-control-flow/`](../../../go/smells/error_handling/exceptions-for-control-flow/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Bloch, J. (2018). *Effective Java* (3rd ed.), Item 69 "Use exceptions only for exceptional conditions". Addison-Wesley.
- Cwalina, K. and Abrams, B. *Framework Design Guidelines* (Addison-Wesley), exception design chapter; also summarized in the .NET documentation ("Best practices for exceptions") on Microsoft Learn.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code*, ch. 7 "Error Handling" (by Michael Feathers). Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
