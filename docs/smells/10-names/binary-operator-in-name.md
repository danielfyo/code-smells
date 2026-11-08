# Binary Operator in Name

> **ID:** CS064 · **Category:** Names · **Sources:** Jerzyk 2023

*Names with And/Or (validateAndSave) that reveal the function does more than one thing.*

## Definition

A function name contains a conjunction such as `And` or `Or` (`validateAndSave`, `loadOrCreate`,
`parseAndSendInvoice`). Jerzyk and Madeyski catalog this pattern because it reveals that the function does
more than one thing and violates the single responsibility principle: each part of the name is a candidate
for a separate function.

## Symptoms

- Names containing `And`, `Or`, `Then` or `_and_` (`check_and_update`, `fetchThenRender`).
- Functions with two clearly separate blocks, often with a comment in between.
- Callers that would like only one of the two actions and cannot have it.
- Boolean parameters to skip one of the parts (`saveAfterValidate: bool`).

## Common causes

- Grouping steps that usually go together to "save" a call.
- Honest naming (which is good) without taking the next step of splitting.

## Why it is a problem

- **Low reuse**: you cannot validate without saving.
- **More complex tests**, which must set up both responsibilities at once.
- A tendency to add flags that disable parts, creating more smells.

## Example (smelly)

```go
// SMELL: the "And" reveals two responsibilities in one function
func ValidateAndSaveOrder(o Order, repo OrderRepository) error {
    if len(o.Lines) == 0 {
        return ErrEmptyOrder
    }
    if o.CustomerID == "" {
        return ErrMissingCustomer
    }
    return repo.Save(o)
}
```

## Solution (refactored)

```go
// REFACTOR: Extract Function; each function has one responsibility
func ValidateOrder(o Order) error {
    if len(o.Lines) == 0 {
        return ErrEmptyOrder
    }
    if o.CustomerID == "" {
        return ErrMissingCustomer
    }
    return nil
}

func PlaceOrder(o Order, repo OrderRepository) error {
    if err := ValidateOrder(o); err != nil {
        return err
    }
    return repo.Save(o)
}
```

## Recommended refactorings

- **Extract Function** for each part of the name.
- **Split Phase** when one part prepares data for the other.
- **Separate Query from Modifier** if one part queries and the other modifies.
- **Change Function Declaration** so the coordinating function gets a higher-level name (`PlaceOrder`).

## When it may be acceptable

- Atomic operations that must happen together for concurrency or transactional reasons (`GetOrAdd`, `compareAndSwap`, `getOrCreate`).
- Standard library conventions with a precise meaning (`setdefault`, `LoadOrStore` on `sync.Map`).

## Related smells

- [Ambiguous Name](ambiguous-name.md): the dishonest alternative: hiding both actions behind a generic verb.
- [Flag / Selector Arguments](../07-functions/flag-arguments.md): flags appear in order to skip one of the parts.
- [Long Method](../01-bloaters/long-method.md): the function tends to grow.
- [Names Should Describe Side-Effects](names-hiding-side-effects.md): the case where the name mentions only one of the actions.

## Automatic detection

- There is no standard rule, but it is easy to automate with regular expressions in naming rules:
- **Python**: Pylint `function-rgx`/`method-rgx` with a pattern that excludes `_and_`/`_or_`.
- **TypeScript**: `@typescript-eslint/naming-convention` with the `custom.regex` option (`match: false`) for `And[A-Z]|Or[A-Z]`.
- **C# and Go**: custom rules (your own Roslyn analyzer, a SonarQube regex template rule) or a search in CI.

## Implementations

- Python: [`python/code_smells/names/binary_operator_in_name/`](../../../python/code_smells/names/binary_operator_in_name/)
- C#: [`csharp/src/CodeSmells/Names/BinaryOperatorInName/`](../../../csharp/src/CodeSmells/Names/BinaryOperatorInName/)
- React + TS: [`react-ts/src/smells/names/binary-operator-in-name/`](../../../react-ts/src/smells/names/binary-operator-in-name/)
- Go: [`go/smells/names/binary-operator-in-name/`](../../../go/smells/names/binary-operator-in-name/)
- Angular: [`angular/src/smells/names/binary-operator-in-name/`](../../../angular/src/smells/names/binary-operator-in-name/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
