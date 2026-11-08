# Magic Numbers / Magic Strings

> **ID:** CS033 · **Category:** Data Dealers · **Sources:** Clean Code G25
>
> Unnamed literals whose meaning has to be guessed.

## Definition

**Magic numbers and magic strings** are literals that appear in the code without a name explaining their
meaning: `if status == 3`, `price * 1.21`, `role == "adm"`. *Clean Code* (G25) asks for them to be
replaced with named constants. The problem is twofold: the reader has to guess what the value
represents, and if the value changes every occurrence must be found (without confusing it with another
`3` that means something else).

## Symptoms

- Numbers other than 0, 1 or -1 in conditions and calculations (`86400`, `0.21`, `30`).
- Strings acting as codes or keys (`"PENDING"`, `"admin"`) repeated in several places.
- Comments explaining the literal (`* 1.21  # VAT`).
- The same literal repeated across several files.

## Common causes

- Writing the value directly for speed.
- Believing the value "will never change".
- Missing enumerations or types for status codes.

## Why it is a problem

- Code that is hard to understand without context.
- Changing the value requires search-and-replace with a risk of mistakes.
- Typos in strings that the compiler cannot catch (`"pendign"`).

## Example (smelly)

```go
func LateFee(daysLate int, amount float64) float64 {
	if daysLate <= 15 {
		return 0
	}
	fee := amount * 0.015 * float64(daysLate-15)
	if fee > 50 {
		return 50
	}
	return fee
}
```

## Solution (refactored)

```go
const (
	gracePeriodDays = 15
	dailyFeeRate    = 0.015
	maxLateFee      = 50.0
)

func LateFee(daysLate int, amount float64) float64 {
	chargeableDays := daysLate - gracePeriodDays
	if chargeableDays <= 0 {
		return 0
	}
	return min(amount*dailyFeeRate*float64(chargeableDays), maxLateFee)
}
```

## Recommended refactorings

- **Replace Magic Literal**: gives the literal a name (in the first edition, *Replace Magic Number with Symbolic Constant*).
- **Replace Primitive with Object**: when the literal encodes a concept with behavior.
- **Replace Type Code with Subclasses**: or enumerations, when the literals are status codes.
- **Extract Variable**: names the result of expressions containing literals.

## When it may be acceptable

- Values whose meaning is obvious from context: `0`, `1`, `-1`, `2` in `x / 2`, `100` in percentages.
- Literals in tests, where seeing the concrete value improves the readability of the case.
- Well-known mathematical or physical formulas where the literal is part of the definition.

## Related smells

- [Primitive Obsession](../01-bloaters/primitive-obsession.md) — magic type codes are primitives asking for a type of their own.
- [Duplicate Code](../04-dispensables/duplicate-code.md) — a repeated literal is duplicated knowledge.
- [Shotgun Surgery](../03-change-preventers/shotgun-surgery.md) — changing a magic value forces you to touch many places.
- [Magic Configuration Strings](../15-csharp/magic-config-strings.md) — C# variant with configuration keys.
- [Stringly Typed Code](../16-react-ts/stringly-typed.md) — TypeScript variant.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Ruff `PLR2004` (`magic-value-comparison`), also available in Pylint as the `pylint.extensions.magic_value` extension (`R2004`). |
| C# | SonarQube `S109` (magic numbers) and `S1192` (duplicated string literals). |
| React + TS | ESLint `no-magic-numbers` / `@typescript-eslint/no-magic-numbers`; `sonarjs/no-duplicate-string`. |
| Go | golangci-lint `mnd` (magic number detector, formerly `gomnd`) and `goconst` (repeated strings); revive `add-constant`. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/data/magic_numbers/`](../../../python/code_smells/data/magic_numbers/) |
| C# | [`csharp/src/CodeSmells/Data/MagicNumbers/`](../../../csharp/src/CodeSmells/Data/MagicNumbers/) |
| React + TS | [`react-ts/src/smells/data/magic-numbers/`](../../../react-ts/src/smells/data/magic-numbers/) |
| Go | [`go/smells/data/magic-numbers/`](../../../go/smells/data/magic-numbers/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
