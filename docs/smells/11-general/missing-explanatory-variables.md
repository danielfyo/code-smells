# Missing Explanatory Variables

> **ID:** CS072 · **Category:** General · **Sources:** Clean Code G19

*Complex expressions not broken down into named intermediate variables.*

## Definition

A complex expression (calculation, condition, chained access) is written in one go without breaking it into
named intermediate variables. *Clean Code* (G19, *Use Explanatory Variables*), following Kent Beck,
recommends splitting calculations into intermediate values with meaningful names: an opaque module becomes
transparent simply by naming its pieces.

## Symptoms

- `if` conditions spanning several lines with mixed `and`/`or`.
- Long formulas with numbers and nested parentheses.
- Index or regex group access (`m.group(3)`, `parts[2]`) used directly.
- A comment needed to explain what an expression computes.

## Common causes

- Writing the expression in one stretch while solving the problem.
- The mistaken belief that fewer variables is more efficient.

## Why it is a problem

- **Slow reading** that is easy to misinterpret.
- **Hard debugging**: there are no intermediate values to inspect.
- Precedence errors go unnoticed.

## Example (smelly)

```python
def can_ship_free(order: Order, today: date) -> bool:
    # SMELL: a condition that has to be deciphered
    return (order.customer.tier in ("gold", "platinum") or sum(
        i.price * i.qty for i in order.items) >= 60) and not (
        order.address.country != "ES" or today.weekday() >= 5)
```

## Solution (refactored)

```python
def can_ship_free(order: Order, today: date) -> bool:
    # REFACTOR: Extract Variable; each part of the rule has a name
    is_premium_customer = order.customer.tier in ("gold", "platinum")
    reaches_threshold = order.subtotal() >= FREE_SHIPPING_THRESHOLD
    is_domestic = order.address.country == "ES"
    is_working_day = today.weekday() < 5
    return (is_premium_customer or reaches_threshold) and is_domestic and is_working_day
```

## Recommended refactorings

- **Extract Variable**.
- **Replace Temp with Query** when the variable is reused across several methods.
- **Decompose Conditional** and **Consolidate Conditional Expression**.
- **Replace Primitive with Object** when tuples or groups are accessed by index.

## When it may be acceptable

- Short, obvious expressions where one more variable would be noise.
- Well-formatted fluent chains (one operation per line) whose method names already explain each step.

## Related smells

- [Obscured Intent / Clever Code](obscured-intent.md): cryptic expressions.
- [Complicated Boolean Expression](../07-functions/complicated-boolean-expression.md): complex conditions.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md): unnamed literals inside expressions.
- [Complicated Regex Expression](complicated-regex.md): unnamed capture groups.
- [Message Chains (Train Wreck)](../05-couplers/message-chains.md): long chains of accesses.

## Automatic detection

- **Python**: Pylint `R0916` (`too-many-boolean-expressions`) and Ruff `PLR2004` (magic values in comparisons).
- **C#**: SonarQube `S1067` (overly complex expressions) and `S3776` (cognitive complexity).
- **TypeScript**: ESLint `complexity`, `no-magic-numbers` and `sonarjs/cognitive-complexity`.
- **Go**: `gocognit` and `mnd` (magic numbers) in golangci-lint.

## Implementations

- Python: [`python/code_smells/general/missing_explanatory_variables/`](../../../python/code_smells/general/missing_explanatory_variables/)
- C#: [`csharp/src/CodeSmells/General/MissingExplanatoryVariables/`](../../../csharp/src/CodeSmells/General/MissingExplanatoryVariables/)
- React + TS: [`react-ts/src/smells/general/missing-explanatory-variables/`](../../../react-ts/src/smells/general/missing-explanatory-variables/)
- Go: [`go/smells/general/missing-explanatory-variables/`](../../../go/smells/general/missing-explanatory-variables/)
- Angular: [`angular/src/smells/general/missing-explanatory-variables/`](../../../angular/src/smells/general/missing-explanatory-variables/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Beck, K. (2002). *Test-Driven Development: By Example*. Addison-Wesley.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
