# Artificial Coupling

> **ID:** CS030 · **Category:** Couplers · **Sources:** Clean Code G13
>
> Elements that do not depend on each other are coupled because they are declared together (generic constants inside concrete classes).

## Definition

**Artificial coupling** (*Clean Code* G13) appears when two elements that do not depend on each other end
up coupled because one is declared inside the other for convenience. The classic example: a general
purpose constant or enumeration (`MAX_RETRIES`, `Currency`) defined inside a concrete class
(`PaymentService.MAX_RETRIES`), so everyone who needs it has to depend on that class.

Martin explains it as putting things in the first convenient place instead of thinking about where they
should be declared.

## Symptoms

- Generic constants, enumerations or helper functions defined inside specific classes.
- Modules that import a large class just to use a constant.
- Dependencies between packages with no functional relationship.
- Import cycles caused by misplaced utilities.

## Common causes

- Declaring the element where it was first needed.
- Not revisiting its location when the element starts being used elsewhere.

## Why it is a problem

- Unnecessary dependencies that increase compile or load time.
- Changes to the containing class affect modules that only wanted the constant.
- Dependency cycles and architectures that are hard to split.

## Example (smelly)

```go
package payment

// SMELL: generic types and constants inside a concrete package
type Currency string

const (
	EUR Currency = "EUR"
	USD Currency = "USD"
)

type StripeGateway struct{ /* ... */ }

// package catalog must import payment (and its dependencies) just for Currency
```

## Solution (refactored)

```go
package money

// REFACTOR: the general concept lives in its own package with no dependencies
type Currency string

const (
	EUR Currency = "EUR"
	USD Currency = "USD"
)

// packages payment and catalog import money; they do not depend on each other
```

## Recommended refactorings

- **Move Function**: and **Move Field**: move the element to a neutral module.
- **Extract Class**: or extract a module, to group related general-purpose constants and types.

## When it may be acceptable

- Constants that really belong to the concept (`Order.MAX_LINES`) and only make sense in relation to it.
- Elements used in a single place, even if they look generic.

## Related smells

- [Misplaced Responsibility](../11-general/misplaced-responsibility.md) — code located where it does not belong.
- [utils / common Packages](../17-go/utils-package.md) — the opposite extreme: lumping everything generic into a catch-all package.
- [Configurable Data at Low Levels](../11-general/configurable-data-at-low-levels.md) — another way of misplacing data.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md) — extracted constants must be placed correctly.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0401 cyclic-import`; `import-linter` for dependency contracts. |
| C# | `CA1506` (excessive coupling); NDepend or ArchUnitNET for dependencies between namespaces. |
| React + TS | `import/no-cycle`; `dependency-cruiser`; `madge` to visualize the dependency graph. |
| Go | The compiler forbids import cycles; `depguard` and package graph analysis (`go list -deps`). |

Dependency graph tools show suspicious edges; deciding whether they are artificial requires human judgment.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/artificial_coupling/`](../../../python/code_smells/couplers/artificial_coupling/) |
| C# | [`csharp/src/CodeSmells/Couplers/ArtificialCoupling/`](../../../csharp/src/CodeSmells/Couplers/ArtificialCoupling/) |
| React + TS | [`react-ts/src/smells/couplers/artificial-coupling/`](../../../react-ts/src/smells/couplers/artificial-coupling/) |
| Go | [`go/smells/couplers/artificial-coupling/`](../../../go/smells/couplers/artificial-coupling/) |
| Angular | [`angular/src/smells/couplers/artificial-coupling/`](../../../angular/src/smells/couplers/artificial-coupling/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
