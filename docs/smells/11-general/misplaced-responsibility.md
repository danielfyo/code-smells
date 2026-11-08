# Misplaced Responsibility

> **ID:** CS071 · **Category:** General · **Sources:** Clean Code G17

*Code placed where it was convenient for the author, not where a reader would look for it.*

## Definition

A piece of code sits where it was convenient for its author, not where a reader would look for it. For
example, VAT calculation in the HTTP controller, or a `PI` constant in an orders class. *Clean Code* (G17,
*Misplaced Responsibility*) reminds us that one of the most important decisions is *where* to put code: it
should go where the principle of least surprise suggests.

## Symptoms

- Business rules in controllers, views, components or migration scripts.
- Utility functions that operate exclusively on another class's data.
- Difficulty answering "where is X computed?" without searching the whole project.
- The same calculation duplicated because the original was in an unexpected place.

## Common causes

- Adding code to whatever file was already open.
- Unclear architecture or no defined layers.
- Unfamiliarity with the domain model.

## Why it is a problem

- **Hard to find**, and therefore hard to reuse and change.
- **Duplication** because nobody knows the existing implementation.
- Coupling between layers that should be independent.

## Example (smelly)

```go
func (h *OrderHandler) Create(w http.ResponseWriter, r *http.Request) {
    var o Order
    _ = json.NewDecoder(r.Body).Decode(&o)
    // SMELL: business rule (discount and total) inside the HTTP handler
    total := 0.0
    for _, l := range o.Lines {
        total += l.Price * float64(l.Qty)
    }
    if total > 100 {
        total *= 0.95
    }
    o.Total = total
    h.repo.Save(o)
}
```

## Solution (refactored)

```go
// REFACTOR: Move Function; the rule lives in the domain, where one would look for it
func (o Order) Total() Money {
    total := o.Subtotal()
    if total > VolumeDiscountThreshold {
        total = total.Percent(95)
    }
    return total
}

func (h *OrderHandler) Create(w http.ResponseWriter, r *http.Request) {
    o, err := decodeOrder(r)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    h.service.Place(r.Context(), o) // the handler only translates HTTP
}
```

## Recommended refactorings

- **Move Function** and **Move Field** to the module or class they belong to.
- **Extract Class** when the responsibility does not have a home yet.
- **Combine Functions into Class** to group scattered behavior over the same data.

## When it may be acceptable

- Prototypes and small scripts without a layered architecture.
- Presentation logic (formatting, labels) that does belong in the view layer.

## Related smells

- [Feature Envy](../05-couplers/feature-envy.md): a function more interested in another class than in its own.
- [Business Logic in Components](../16-react-ts/business-logic-in-components.md): the typical case in React.
- [Shotgun Surgery](../03-change-preventers/shotgun-surgery.md): scattered responsibilities force changes in many places.
- [Multiple Languages in One Source File](multiple-languages-in-file.md): another mix of responsibilities in one file.
- [Configurable Data at Low Levels](configurable-data-at-low-levels.md): configuration in the wrong place.

## Automatic detection

- **Architecture rules**: ArchUnitNET or NetArchTest in .NET, `import-linter` in Python, `dependency-cruiser` or `eslint-plugin-boundaries` in TypeScript, `depguard` in Go (golangci-lint) prevent forbidden dependencies between layers.
- **Cohesion metrics**: SonarQube and tools such as NDepend point to classes with low cohesion or feature envy.

The right location depends on the domain; detection is mostly a design and review task.

## Implementations

- Python: [`python/code_smells/general/misplaced_responsibility/`](../../../python/code_smells/general/misplaced_responsibility/)
- C#: [`csharp/src/CodeSmells/General/MisplacedResponsibility/`](../../../csharp/src/CodeSmells/General/MisplacedResponsibility/)
- React + TS: [`react-ts/src/smells/general/misplaced-responsibility/`](../../../react-ts/src/smells/general/misplaced-responsibility/)
- Go: [`go/smells/general/misplaced-responsibility/`](../../../go/smells/general/misplaced-responsibility/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
