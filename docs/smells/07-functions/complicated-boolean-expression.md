# Complicated Boolean Expression

> **ID:** CS042 · **Category:** Functions & Conditional Logic · **Sources:** Clean Code G28; Jerzyk 2023
>
> Long, opaque conditions that should be encapsulated in named functions or variables.

## Definition

A **complicated boolean expression** is a long condition with many `and`/`or`/`not` operators, nested
parentheses and heterogeneous comparisons whose meaning cannot be grasped at a glance. *Clean Code*
(G28) recommends encapsulating conditionals in functions whose names express the intent:
`if should_be_deleted(timer)` is preferable to `if timer.has_expired() and not timer.is_recurrent()`.

The condition expresses a **business rule**; if it has no name, the rule stays invisible and tends to be
duplicated.

## Symptoms

- Conditions spanning several lines or mixing `&&` and `||` with nested parentheses.
- Comparisons of several different objects in the same expression.
- The same complex condition repeated in several places.
- Comments explaining what the condition means.

## Common causes

- Adding cases to an existing condition with one more `or`.
- Failing to identify the business concept the condition expresses.

## Why it is a problem

- Logic errors due to operator precedence or misapplied negations.
- Hidden, duplicated business rules.
- Hard to test exhaustively (many combinations).

## Example (smelly)

```ts
if (
  (user.role === "admin" || (user.role === "editor" && doc.ownerId === user.id)) &&
  !doc.locked &&
  (doc.status !== "archived" || user.role === "admin")
) {
  enableEditing();
}
```

## Solution (refactored)

```ts
const isAdmin = (u: User) => u.role === "admin";
const isOwnerEditor = (u: User, d: Doc) => u.role === "editor" && d.ownerId === u.id;
const isEditableStatus = (u: User, d: Doc) => d.status !== "archived" || isAdmin(u);

function canEdit(user: User, doc: Doc): boolean {
  const hasRole = isAdmin(user) || isOwnerEditor(user, doc);
  return hasRole && !doc.locked && isEditableStatus(user, doc);
}

if (canEdit(user, doc)) enableEditing();
```

## Recommended refactorings

- **Decompose Conditional**: extracts the condition into a named function.
- **Extract Variable**: names the subexpressions (explaining variables).
- **Consolidate Conditional Expression**: groups checks that lead to the same result.
- **Replace Nested Conditional with Guard Clauses**: splits the conditions into early exits.

## When it may be acceptable

- Conditions with two or three homogeneous, obvious terms (`0 <= x < width`).
- Expressions inside a function whose name already explains the rule and that are not repeated.

## Related smells

- [Negative Conditionals](negative-conditionals.md) — negations make expressions even more complicated.
- [Missing Explanatory Variables](../11-general/missing-explanatory-variables.md) — lack of variables naming subexpressions.
- [Deep Nesting / Arrow Code](deep-nesting.md) — the equally problematic alternative of nesting conditions.
- [Obscured Intent / Clever Code](../11-general/obscured-intent.md) — expressions that hide their purpose.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0916 too-many-boolean-expressions`; Ruff `PLR0916` (preview), `SIM` (boolean simplifications). |
| C# | SonarQube `S1067` (expressions should not be too complex) and `S3776`. |
| React + TS | `complexity`, `sonarjs/cognitive-complexity`; `no-mixed-operators` for mixing `&&` and `||` without parentheses. |
| Go | golangci-lint `gocognit`, `gocyclo`; gocritic `boolExprSimplify`. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/functions/complicated_boolean_expression/`](../../../python/code_smells/functions/complicated_boolean_expression/) |
| C# | [`csharp/src/CodeSmells/Functions/ComplicatedBooleanExpression/`](../../../csharp/src/CodeSmells/Functions/ComplicatedBooleanExpression/) |
| React + TS | [`react-ts/src/smells/functions/complicated-boolean-expression/`](../../../react-ts/src/smells/functions/complicated-boolean-expression/) |
| Go | [`go/smells/functions/complicated-boolean-expression/`](../../../go/smells/functions/complicated-boolean-expression/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
