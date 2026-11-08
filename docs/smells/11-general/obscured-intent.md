# Obscured Intent / Clever Code

> **ID:** CS070 · **Category:** General · **Sources:** Clean Code G16; Jerzyk 2023

*Compact, cryptic code that shows off cleverness but hides what it does.*

## Definition

Code written so compactly or cleverly that it hides what it does: chained expressions on one line, bitwise
operators for business logic, nested ternaries, magic numbers, language tricks. *Clean Code* (G16, *Obscured
Intent*) asks not to hide intent; Jerzyk and Madeyski catalog it as *Obscured Intent* or *Clever Code*: it
shows skill, but the next reader pays the price.

## Symptoms

- A single line with several chained operations that need pen and paper to understand.
- Nested ternaries, `&&`/`||` used for side effects, bitwise operators for business flags.
- Relying on implicit coercions (`!!x`, `+str`, `~arr.indexOf(x)`).
- Comprehensions or LINQ expressions with several conditions and side effects.

## Common causes

- Wanting to write short or impressive code.
- Premature optimization.
- Competitive programming habits carried into production code.

## Why it is a problem

- **Slow, error-prone reading**.
- **Subtle bugs** hidden in operator precedence and coercions.
- Fear of modifying the code because nobody fully understands it.

## Example (smelly)

```typescript
// SMELL: what exactly does this return?
const fee = (o: Order) =>
  ((o.items.length > 3) << 1 | +!!o.express) & 2 ? 0 : o.express ? o.weight > 5 ? 12 : 8 : 4;
```

## Solution (refactored)

```typescript
const FREE_SHIPPING_MIN_ITEMS = 4;

// REFACTOR: guard clauses and names that express the business rule
function shippingFee(order: Order): number {
  if (order.items.length >= FREE_SHIPPING_MIN_ITEMS) return 0;
  if (!order.express) return 4;
  return order.weight > 5 ? 12 : 8;
}
```

## Recommended refactorings

- **Extract Variable** and **Extract Function** to name each step.
- **Decompose Conditional** and **Replace Nested Conditional with Guard Clauses**.
- **Replace Magic Literal** (Fowler 2018) with a named constant.
- **Substitute Algorithm** with a more direct one.

## When it may be acceptable

- Performance-critical, measured code encapsulated behind a well-named function with a comment explaining the trick.
- Widely known idioms in the ecosystem (e.g. `x ?? default`, destructuring).

## Related smells

- [Missing Explanatory Variables](missing-explanatory-variables.md): lack of intermediate variables obscures expressions.
- [Complicated Boolean Expression](../07-functions/complicated-boolean-expression.md): conditions that are hard to read.
- [Nested Ternaries in JSX](../16-react-ts/nested-ternaries-jsx.md): nested ternaries in JSX.
- [Overly Complex Comprehension](../14-python/complex-comprehension.md): cryptic comprehensions in Python.
- [Complicated Regex Expression](complicated-regex.md): another form of cryptic code.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md): unexplained literals.

## Automatic detection

- **Python**: Ruff `C901`/Pylint `R1260` (complexity), Pylint `R0916` (`too-many-boolean-expressions`), Ruff `SIM` rules that propose simpler forms.
- **C#**: SonarQube `S3776` (cognitive complexity), `S3358` (nested ternaries) and `S1067` (overly complex expressions).
- **TypeScript**: ESLint `no-nested-ternary`, `no-bitwise`, `no-implicit-coercion`, `complexity`; `sonarjs/cognitive-complexity`.
- **Go**: `gocognit`, `gocyclo` and `nestif` in golangci-lint.

## Implementations

- Python: [`python/code_smells/general/obscured_intent/`](../../../python/code_smells/general/obscured_intent/)
- C#: [`csharp/src/CodeSmells/General/ObscuredIntent/`](../../../csharp/src/CodeSmells/General/ObscuredIntent/)
- React + TS: [`react-ts/src/smells/general/obscured-intent/`](../../../react-ts/src/smells/general/obscured-intent/)
- Go: [`go/smells/general/obscured-intent/`](../../../go/smells/general/obscured-intent/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
