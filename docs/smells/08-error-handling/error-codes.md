# Returning Error Codes

> **ID:** CS047 · **Category:** Error Handling · **Sources:** Clean Code ch. 7

*Returning -1, null or magic codes instead of explicit errors that cannot be ignored.*

## Definition

A function signals failure by returning a special value inside its normal return type: `-1`, `null`, `""`,
`false` or a magic integer the caller must know about and check. *Clean Code* (ch. 7) recommends exceptions
instead (or, in languages like Go, an explicit and separate error value), because error codes mix the happy
path with failure handling and are very easy to ignore.

## Symptoms

- Returns such as `return -1`, `return null`, `return 0` or `return "ERR_STOCK"` to signal failure.
- Callers full of `if result == -1:` or `if (code !== 0)` right after every call.
- Code constants or enums (`ERR_NOT_FOUND = 2`) that travel through several layers.
- Return values that mean both "valid data" and "error" (a `0` that could be a real balance).
- In Go, returning a sentinel in the main value instead of using the second `error` return.

## Common causes

- Legacy from C or old APIs without exceptions.
- The belief that exceptions are always expensive or "dangerous".
- Reluctance to design proper error types or a result type (`Result`, discriminated union).

## Why it is a problem

- **Easy to ignore**: nothing forces the code to be checked; the error becomes valid data downstream.
- **Business logic buried** among code checks, which hurts readability.
- **Semantic ambiguity**: `-1` or `null` say nothing about *what* failed or why.
- Coupling to a shared code table that, as it grows, causes recompilations and cascading changes.

## Example (smelly)

```typescript
// SMELL: -1 and -2 are magic codes the caller has to know
function withdraw(account: Account, amount: number): number {
  if (amount <= 0) return -2;
  if (account.balance < amount) return -1;
  account.balance -= amount;
  return account.balance;
}

const result = withdraw(account, 50);
if (result === -1) showMessage("Insufficient funds");
// Whoever forgets to check -2 will display it as a balance
```

## Solution (refactored)

```typescript
type WithdrawError = "invalid-amount" | "insufficient-funds";
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

// REFACTOR: the error is an explicit part of the return type
function withdraw(account: Account, amount: number): Result<number, WithdrawError> {
  if (amount <= 0) return { ok: false, error: "invalid-amount" };
  if (account.balance < amount) return { ok: false, error: "insufficient-funds" };
  account.balance -= amount;
  return { ok: true, value: account.balance };
}

const result = withdraw(account, 50);
if (!result.ok) showMessage(messages[result.error]);
else showBalance(result.value); // the compiler forces both cases to be handled
```

In Python and C# the natural alternative is to raise a specific exception (`InsufficientFundsError`); in Go,
return `(balance, error)` with sentinel errors (`ErrInsufficientFunds`) comparable with `errors.Is`.

## Recommended refactorings

- **Replace Error Code with Exception**.
- **Replace Primitive with Object**: a result type or a typed error instead of an integer.
- **Introduce Special Case** when the "error" is actually a business case with its own behavior.
- **Separate Query from Modifier** if the return code mixes state and result.

## When it may be acceptable

- In Go, returning `error` as the last value is idiomatic; the smell appears when a sentinel is used inside the main value.
- Very hot loops or interop with C/native APIs, where a status code is the contract.
- `TryXxx` methods (`int.TryParse`, `dict.get`) whose name makes it clear that failure is an expected outcome and whose type models it (`bool` + `out`, `Optional`).

## Related smells

- [Swallowed Exceptions / Afraid to Fail](swallowed-exceptions.md): an unchecked code is equivalent to a swallowed error.
- [Null Check / Null Abuse](../06-data/null-abuse.md): `null` is the most common error code.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md): codes are usually magic numbers.
- [Boolean Blindness](../06-data/boolean-blindness.md): returning `false` without explaining why.
- [Exceptions for Control Flow](exceptions-for-control-flow.md): the opposite extreme, which is not desirable either.

## Automatic detection

- **Python**: type checkers (mypy/Pyright in strict mode) force `Optional` to be handled; there is no specific rule for magic codes, but Ruff `PLR2004` (magic value comparison) flags comparisons such as `== -1`.
- **C#**: `CA1806` (*Do not ignore method results*) and nullable reference types (`<Nullable>enable</Nullable>`), which warn when a possibly null result is used.
- **TypeScript**: `strictNullChecks` and `@typescript-eslint/strict-boolean-expressions`; ESLint `no-magic-numbers` for comparisons with `-1`.
- **Go**: `errcheck` ensures returned `error` values are checked; review functions returning sentinels instead of `error` manually.

## Implementations

- Python: [`python/code_smells/error_handling/error_codes/`](../../../python/code_smells/error_handling/error_codes/)
- C#: [`csharp/src/CodeSmells/ErrorHandling/ErrorCodes/`](../../../csharp/src/CodeSmells/ErrorHandling/ErrorCodes/)
- React + TS: [`react-ts/src/smells/error_handling/error-codes/`](../../../react-ts/src/smells/error_handling/error-codes/)
- Go: [`go/smells/error_handling/error-codes/`](../../../go/smells/error_handling/error-codes/)
- Angular: [`angular/src/smells/error_handling/error-codes/`](../../../angular/src/smells/error_handling/error-codes/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 7 "Error Handling" (by Michael Feathers). Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Cwalina, K. and Abrams, B. *Framework Design Guidelines* (Addison-Wesley), exception design chapter; also summarized in the .NET documentation ("Best practices for exceptions") on Microsoft Learn.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
