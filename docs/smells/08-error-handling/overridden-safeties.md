# Overridden Safeties

> **ID:** CS049 · **Category:** Error Handling · **Sources:** Clean Code G4

*Turning off compiler warnings, linters or failing tests just to "keep going".*

## Definition

The mechanisms that protect code quality are disabled to "move on": compiler warnings are silenced,
`# noqa`, `// eslint-disable`, `#pragma warning disable` or `//nolint` are sprinkled liberally, failing tests
are marked as skipped or the coverage threshold is lowered. *Clean Code* (G4, *Overridden Safeties*) warns
that switching off the alarms is dangerous: every silenced warning is a postponed problem.

## Symptoms

- Suppression directives with no specific rule or justification (`# type: ignore`, `/* eslint-disable */` at the top of a file).
- `<NoWarn>` or `<TreatWarningsAsErrors>false</TreatWarningsAsErrors>` added so that a branch compiles.
- Tests marked as `skip`/`Ignore` "temporarily" for months.
- Linter configurations with dozens of disabled rules, or coverage thresholds lowered without team agreement.
- Uses of `any`, `!` (non-null assertion) or forced casts to quiet the type checker.

## Common causes

- Delivery pressure and pipelines that block integration.
- Noisy or poorly configured warnings that the team learns to ignore.
- No clear policy on when a suppression is allowed and how to document it.

## Why it is a problem

- **Real bugs hidden** behind warnings that were relevant (nulls, conversions, undisposed resources).
- **Eroded trust** in the tools: if everything is silenced, nobody looks at new warnings.
- Suppressions outlive their original cause and end up hiding different problems.
- Disabled tests leave functionality without a safety net, making regressions easier.

## Example (smelly)

```typescript
/* eslint-disable */
// SMELL: the whole file's linting is switched off and the type is forced
export function totalWithTax(cart: any) {
  // @ts-ignore
  return cart.items.reduce((sum, item) => sum + item.price * item.qty, 0) * TAX;
}

it.skip("applies the reduced VAT rate to books", () => {
  // broken since the last change, we'll look at it later
});
```

## Solution (refactored)

```typescript
interface CartItem { price: number; qty: number; category: Category }
interface Cart { items: CartItem[] }

// REFACTOR: explicit types instead of any + ts-ignore; the linter is watching again
export function totalWithTax(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.price * item.qty * taxRate(item.category), 0);
}

it("applies the reduced VAT rate to books", () => {
  expect(totalWithTax({ items: [{ price: 10, qty: 1, category: "book" }] })).toBeCloseTo(10.4);
});
```

If a suppression is truly needed, it must be local, target a specific rule and explain why, e.g.
`// eslint-disable-next-line no-console -- intentional CLI output`.

## Recommended refactorings

- **Fix the cause of the warning** instead of silencing it; if it is a false positive, adjust the rule configuration globally and with a rationale.
- **Narrow suppressions** to one line and one rule, with a mandatory justification.
- **Re-enable or delete ignored tests**: either repair them or remove them if they no longer add value (see *Ignored Tests*).
- **Introduce Assertion** or more precise types instead of forcing with `any`, `!` or casts.

## When it may be acceptable

- Documented false positives of a specific rule, suppressed on the affected line with the reason.
- Generated code excluded from analysis in the configuration, not by hand in each file.
- Gradual migrations (e.g. enabling `strict` in TypeScript) with an exception list that shrinks measurably.

## Related smells

- [Ignored Tests](../12-tests/ignored-tests.md): disabling tests is a way of overriding safeties.
- [Swallowed Exceptions / Afraid to Fail](swallowed-exceptions.md): silencing errors at run time.
- [any Abuse](../16-react-ts/any-type.md): `any` switches off TypeScript's type system.
- [Non-null Assertion Abuse](../16-react-ts/non-null-assertion.md): `!` forces the compiler to be quiet.
- [Null-Forgiving Operator Abuse](../15-csharp/null-forgiving-abuse.md): C#'s `!` operator used to silence nullability warnings.

## Automatic detection

- **Python**: Ruff `PGH004` (`blanket-noqa`), `PGH003` (`blanket-type-ignore`) and `RUF100` (unused `noqa`); Pylint `useless-suppression` (`I0021`); mypy `warn_unused_ignores`.
- **C#**: `IDE0079` (unnecessary suppression), enable `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>` and review `<NoWarn>` in `.csproj` files; xUnit `xUnit1004` for tests with `Skip`.
- **TypeScript**: ESLint with `--report-unused-disable-directives`, `@typescript-eslint/ban-ts-comment` and the `eslint-plugin-eslint-comments` rules (`no-unlimited-disable`, `require-description`); `jest/no-disabled-tests` or its Vitest equivalent.
- **Go**: golangci-lint's `nolintlint` requires every `//nolint` to name the linter and give an explanation.

## Implementations

- Python: [`python/code_smells/error_handling/overridden_safeties/`](../../../python/code_smells/error_handling/overridden_safeties/)
- C#: [`csharp/src/CodeSmells/ErrorHandling/OverriddenSafeties/`](../../../csharp/src/CodeSmells/ErrorHandling/OverriddenSafeties/)
- React + TS: [`react-ts/src/smells/error_handling/overridden-safeties/`](../../../react-ts/src/smells/error_handling/overridden-safeties/)
- Go: [`go/smells/error_handling/overridden-safeties/`](../../../go/smells/error_handling/overridden-safeties/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Hunt, A. and Thomas, D. (2019). *The Pragmatic Programmer* (20th anniversary ed.). Addison-Wesley.
