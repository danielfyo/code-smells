# Data Clumps

> **ID:** CS005 · **Category:** Bloaters · **Sources:** Fowler 1999
>
> The same groups of variables travel together everywhere (street, city, postal code) without being grouped into an object.

## Definition

**Data clumps** are sets of variables that show up together again and again: as fields of several
classes, as parameters of several functions, or as columns that are always read together. Street, city
and postal code; start date and end date; latitude and longitude.

Fowler's test is simple: if you delete one of the values in the group, do the others still make sense
on their own? If not, the group is an object waiting to be born.

## Symptoms

- The same three or four parameters appear in many signatures.
- Several classes have fields with the same names and types (`street`, `city`, `zip`).
- Loose values are passed around and always validated together.
- Utility functions that operate on the group (`format_address(street, city, zip)`).

## Common causes

- Copying and pasting signatures and structures.
- Designs driven by the database schema, where the group is a set of loose columns.
- Failing to identify the domain concept that ties the data together.

## Why it is a problem

- Long, repetitive parameter lists.
- Logic on the group (validation, formatting, comparison) gets duplicated.
- Adding a field to the group (e.g. the country) means touching many signatures: shotgun surgery.

## Example (smelly)

```go
func ShippingCost(street, city, zip, country string, weightKg float64) float64 {
	if country != "ES" {
		return 25
	}
	return 5 + weightKg
}

func PrintLabel(name, street, city, zip, country string) string {
	return fmt.Sprintf("%s\n%s\n%s %s (%s)", name, street, zip, city, country)
}
```

## Solution (refactored)

```go
type Address struct {
	Street, City, Zip, Country string
}

func (a Address) IsDomestic() bool { return a.Country == "ES" }

func (a Address) String() string {
	return fmt.Sprintf("%s\n%s %s (%s)", a.Street, a.Zip, a.City, a.Country)
}

func ShippingCost(to Address, weightKg float64) float64 {
	if !to.IsDomestic() {
		return 25
	}
	return 5 + weightKg
}

func PrintLabel(name string, to Address) string { return name + "\n" + to.String() }
```

The clump becomes the `Address` type, which also attracts the behavior that used to be scattered.

## Recommended refactorings

- **Extract Class**: when the clump appears as fields of a class.
- **Introduce Parameter Object**: when the clump appears in function signatures.
- **Preserve Whole Object**: passes the object instead of unpacking its fields.
- **Move Function**: once the type exists, moves the logic that operates on the group into it.

## When it may be acceptable

- Very generic pairs with no domain meaning (`x, y` in a low-level math function).
- Boundaries with external APIs that impose a flat shape on the data.

## Related smells

- [Long Parameter List](long-parameter-list.md) — data clumps lengthen signatures.
- [Primitive Obsession](primitive-obsession.md) — clumps are usually made of primitives.
- [Shotgun Surgery](../03-change-preventers/shotgun-surgery.md) — extending the clump forces changes in many places.
- [Duplicate Code](../04-dispensables/duplicate-code.md) — logic on the clump gets repeated.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No specific rule; Pylint `R0913 too-many-arguments` and `R0801 duplicate-code` help find repeated signatures. |
| C# | No specific Roslyn rule; SonarQube `S107` and duplicated-block detection give hints. |
| React + TS | ESLint `max-params`; `jscpd` for duplicated signatures and structures. |
| Go | gocritic `paramTypeCombine` and revive `argument-limit` as hints; `dupl` for repeated structures. |

Reliable detection requires comparing parameter sets across functions; some research tools do this, but in practice it is caught in review.

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/bloaters/data_clumps/`](../../../python/code_smells/bloaters/data_clumps/) |
| C# | [`csharp/src/CodeSmells/Bloaters/DataClumps/`](../../../csharp/src/CodeSmells/Bloaters/DataClumps/) |
| React + TS | [`react-ts/src/smells/bloaters/data-clumps/`](../../../react-ts/src/smells/bloaters/data-clumps/) |
| Go | [`go/smells/bloaters/data-clumps/`](../../../go/smells/bloaters/data-clumps/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Data Clumps: https://refactoring.guru/smells/data-clumps
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
