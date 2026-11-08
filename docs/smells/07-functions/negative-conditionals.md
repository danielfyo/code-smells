# Negative Conditionals

> **ID:** CS043 · **Category:** Functions & Conditional Logic · **Sources:** Clean Code G29
>
> Conditions expressed negatively (or as double negatives) that are harder to read than their positive form.

## Definition

**Negative conditionals** (*Clean Code* G29) are conditions expressed negatively (or, worse, with a
double negation) when the positive form would be easier to read: `if not is_not_valid(x)`,
`if (!disabled)`, `if !(a != b)`. Negations require an extra mental step and, when combined, lead to
logic errors.

Martin sums it up: negatives are just a bit harder to understand than positives, so when possible,
conditionals should be expressed as positives.

## Symptoms

- Negative variable or function names (`not_found`, `isNotValid`, `disabled`, `noErrors`).
- Double negations: `!isNotEmpty`, `not not_found`.
- `if not cond: ... else: ...` where swapping the order would read more naturally.
- Negated comparisons: `!(a == b)`, `not x > 0`.

## Common causes

- Flags defined negatively from the start (`disabled` instead of `enabled`).
- Adding a negation instead of creating the positive predicate.

## Why it is a problem

- More cognitive load and more logic errors, especially when combined with `and`/`or` (De Morgan's laws).
- Confusion when reading and reviewing code.

## Example (smelly)

```csharp
public bool IsNotEligible(Customer c) => c.Age < 18 || !c.HasAcceptedTerms;

if (!IsNotEligible(customer))
{
    ApplyPromotion(customer);
}
else
{
    Reject(customer);
}
```

## Solution (refactored)

```csharp
public bool IsEligible(Customer c) => c.Age >= MinimumAge && c.HasAcceptedTerms;

if (IsEligible(customer))
{
    ApplyPromotion(customer);
}
else
{
    Reject(customer);
}
```

## Recommended refactorings

- **Change Function Declaration**: renames negative predicates to their positive form.
- **Extract Variable**: names the condition positively.
- **Decompose Conditional**: lets you write each branch's condition in positive terms and swap branches to remove the negation.
- **Replace Nested Conditional with Guard Clauses**: a negation in a guard clause usually reads naturally (`if not user: return`).

## When it may be acceptable

- Guard clauses (`if (!isValid) return;`), where the negation is short and the pattern is recognizable.
- Domain concepts that are inherently negative (`isOverdue`, `isBlocked`).

## Related smells

- [Complicated Boolean Expression](complicated-boolean-expression.md) — negations complicate boolean expressions.
- [Mysterious / Uncommunicative Name](../10-names/uncommunicative-name.md) — negative names communicate worse.
- [Boolean Blindness](../06-data/boolean-blindness.md) — booleans without a clear name become even more opaque when negated.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `C0117 unnecessary-negation` and `C0113 unneeded-not`; Ruff `SIM201`/`SIM202` (negated `==`/`!=`), `SIM208` (double negation). |
| C# | SonarQube `S1940` (boolean checks should not be inverted) and `S1125`; `IDE0075` (simplify conditional expression). |
| React + TS | ESLint `no-negated-condition`, `no-extra-boolean-cast`; `unicorn/no-negated-condition`; `sonarjs/no-inverted-boolean-check`. |
| Go | gocritic `boolExprSimplify`; staticcheck `QF1001` (apply De Morgan's law). |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/functions/negative_conditionals/`](../../../python/code_smells/functions/negative_conditionals/) |
| C# | [`csharp/src/CodeSmells/Functions/NegativeConditionals/`](../../../csharp/src/CodeSmells/Functions/NegativeConditionals/) |
| React + TS | [`react-ts/src/smells/functions/negative-conditionals/`](../../../react-ts/src/smells/functions/negative-conditionals/) |
| Go | [`go/smells/functions/negative-conditionals/`](../../../go/smells/functions/negative-conditionals/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
