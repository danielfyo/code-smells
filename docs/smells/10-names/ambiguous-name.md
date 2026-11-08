# Ambiguous Name

> **ID:** CS059 · **Category:** Names · **Sources:** Clean Code N4

*Names open to several interpretations, such as doRename or process.*

## Definition

A name that admits several reasonable interpretations: `process()`, `handle()`, `doRename()`, `check()`,
`update(data)`, `flag`. *Clean Code* (N4, *Unambiguous Names*) shows the example of `doRename()`, which in
fact renamed and also moved pages; the right name described both actions. An ambiguous name forces readers to
open the implementation to know what happens.

## Symptoms

- Generic verbs with no object: `process`, `handle`, `manage`, `run`, `doIt`.
- Booleans without a clear question: `flag`, `status`, `check`, `valid` (valid according to what?).
- Two functions with near-identical names and different behavior (`update` and `updateAll`).
- `check()` methods where it is unclear whether they return a boolean, throw or fix the data.

## Common causes

- The function does too many things and no concrete name fits.
- Names chosen early, when the responsibility was still unclear, and never revisited.

## Why it is a problem

- **Incorrect use** of the API because of wrong caller assumptions.
- **Forced reading of the implementation**, which defeats the purpose of the abstraction.
- Vaguely named functions attract more responsibilities over time.

## Example (smelly)

```go
// SMELL: what does it mean to "process" an order? and what does true mean?
func Process(o *Order) bool {
    if o.Total() <= 0 {
        return false
    }
    o.Status = Paid
    return true
}
```

## Solution (refactored)

```go
// REFACTOR: the name says exactly what it does and the error explains why it fails
func MarkAsPaid(o *Order) error {
    if o.Total() <= 0 {
        return ErrEmptyOrder
    }
    o.Status = Paid
    return nil
}
```

## Recommended refactorings

- **Change Function Declaration** with a precise verb and object.
- **Extract Function** or **Split Phase** if the name is ambiguous because the function does several things.
- **Rename Variable** so booleans read as questions (`isPaid`, `hasStock`).

## When it may be acceptable

- Methods imposed by an interface or framework (`Handle` in a message handler, `ServeHTTP` in Go, `handleSubmit` in React) when the enclosing type provides the context.
- Scopes so small that the context removes the ambiguity.

## Related smells

- [Mysterious / Uncommunicative Name](uncommunicative-name.md): names that say nothing versus names that say several things.
- [Binary Operator in Name](binary-operator-in-name.md): the honest alternative, although it signals too many responsibilities.
- [Names Should Describe Side-Effects](names-hiding-side-effects.md): names that leave out part of what happens.
- [Fallacious Method Name](fallacious-method-name.md): names that are outright misleading.

## Automatic detection

- **Python**: Pylint `C0104` (`disallowed-name`) with a project deny list (`process`, `handle`, `data`, `flag`).
- **TypeScript**: ESLint `id-denylist` to ban names such as `process`, `handle`, `data` or `flag` in project code.
- **C# and Go**: no standard rule; configure custom naming rules or catch it in code review.

## Implementations

- Python: [`python/code_smells/names/ambiguous_name/`](../../../python/code_smells/names/ambiguous_name/)
- C#: [`csharp/src/CodeSmells/Names/AmbiguousName/`](../../../csharp/src/CodeSmells/Names/AmbiguousName/)
- React + TS: [`react-ts/src/smells/names/ambiguous-name/`](../../../react-ts/src/smells/names/ambiguous-name/)
- Go: [`go/smells/names/ambiguous-name/`](../../../go/smells/names/ambiguous-name/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 2 "Meaningful Names". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
