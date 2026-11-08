# Combinatorial Explosion

> **ID:** CS015 · **Category:** Change Preventers · **Sources:** Kerievsky 2004; Jerzyk 2023
>
> Many pieces of code do the same thing with different combinations of data or behavior.

## Definition

**Combinatorial explosion** appears when many pieces of code do the same thing with different
combinations of data or behavior: one class or function per combination of dimensions
(`CsvEmailReport`, `CsvSlackReport`, `PdfEmailReport`, `PdfSlackReport`...). Kerievsky describes it as a
subtle form of duplication, and Jerzyk and Madeyski's catalog places it among the change preventers.

With *n* options in one dimension and *m* in another, *n × m* pieces are needed; adding an option
multiplies the work instead of adding to it.

## Symptoms

- Class or function names that combine several dimensions (`findByNameAndCity`, `findByNameAndAge`...).
- Subclasses for every combination of features.
- Nearly identical methods that differ in a filter, a format or a channel.
- Adding a new option requires creating several classes or functions.

## Common causes

- Using inheritance to combine independent dimensions.
- Adding concrete variants instead of parameterizing.
- Failing to identify the problem's dimensions of variation.

## Why it is a problem

- Multiplicative growth of code and tests.
- Massive duplication and high risk of inconsistencies.
- Some combinations are left unimplemented or implemented incorrectly.

## Example (smelly)

```go
func FindByStatus(orders []Order, s string) []Order { /* loop with filter */ }
func FindByCustomer(orders []Order, c string) []Order { /* loop with filter */ }
func FindByStatusAndCustomer(orders []Order, s, c string) []Order { /* ... */ }
func FindByStatusAndMinTotal(orders []Order, s string, min float64) []Order { /* ... */ }
// ...one function per combination of criteria
```

## Solution (refactored)

```go
type Spec func(Order) bool

func ByStatus(s string) Spec    { return func(o Order) bool { return o.Status == s } }
func ByCustomer(c string) Spec  { return func(o Order) bool { return o.Customer == c } }
func MinTotal(min float64) Spec { return func(o Order) bool { return o.Total >= min } }

func Find(orders []Order, specs ...Spec) []Order {
	var out []Order
	for _, o := range orders {
		if all(o, specs) {
			out = append(out, o)
		}
	}
	return out
}

func all(o Order, specs []Spec) bool {
	for _, s := range specs {
		if !s(o) {
			return false
		}
	}
	return true
}
```

Each criterion is written once and combined freely: *n + m* pieces instead of *n × m* (the *Specification* pattern).

## Recommended refactorings

- **Parameterize Function**: merges nearly identical functions that differ in a value.
- **Replace Subclass with Delegate**: turns each dimension into an interchangeable object (*Strategy*, *Decorator*, *Bridge*).
- **Replace Implicit Language with Interpreter**: from Kerievsky, for combinations of search criteria (*Specification*/*Interpreter* pattern).
- **Move Embellishment to Decorator**: from Kerievsky, when the combinations are stacked optional features.

## When it may be acceptable

- A few fixed combinations that will never grow and where each one is more readable on its own.
- Combinations hand-optimized for performance (e.g. specific SQL queries using specific indexes).

## Related smells

- [Duplicate Code](../04-dispensables/duplicate-code.md) — combinatorial explosion is multiplied duplication.
- [Parallel Inheritance Hierarchies](parallel-inheritance-hierarchies.md) — hierarchies that grow in lockstep.
- [Flag / Selector Arguments](../07-functions/flag-arguments.md) — the naive alternative: one function with many control booleans.
- [Boolean Props Explosion](../16-react-ts/boolean-prop-explosion.md) — React variant: components with many combinable boolean props.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0801 duplicate-code` detects the nearly identical implementations. |
| C# | SonarQube duplicated-block detection; `S4144` (methods with identical implementations). |
| React + TS | `jscpd`; `sonarjs/no-identical-functions`. |
| Go | golangci-lint `dupl`. |

Tools detect the resulting duplication, not the combinatorial structure; compound names (`...And...`) are a useful clue in review.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/change_preventers/combinatorial_explosion/`](../../../python/code_smells/change_preventers/combinatorial_explosion/) |
| C# | [`csharp/src/CodeSmells/ChangePreventers/CombinatorialExplosion/`](../../../csharp/src/CodeSmells/ChangePreventers/CombinatorialExplosion/) |
| React + TS | [`react-ts/src/smells/change_preventers/combinatorial-explosion/`](../../../react-ts/src/smells/change_preventers/combinatorial-explosion/) |
| Go | [`go/smells/change_preventers/combinatorial-explosion/`](../../../go/smells/change_preventers/combinatorial-explosion/) |

## References

- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
