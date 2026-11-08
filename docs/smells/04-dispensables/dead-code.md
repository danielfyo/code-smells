# Dead Code

> **ID:** CS019 · **Category:** Dispensables · **Sources:** Fowler 1999; Clean Code G9/F4
>
> Variables, parameters, functions or branches that are never used or executed.

## Definition

**Dead code** is any variable, parameter, field, function, class or conditional branch that is no longer
used or can never execute. *Clean Code* covers it in G9 (dead code) and F4 (dead functions): code that
does not run is not tested, becomes outdated and confuses readers.

The version control system keeps the history; there is no reason to keep in the code what "might be
needed someday".

## Symptoms

- Functions or classes with no references.
- `if` branches whose condition is always false or that follow a `return`.
- Parameters the function ignores.
- Variables assigned and never read; unused imports.
- Feature flags that have been fixed for years.

## Common causes

- Changing requirements that leave functionality orphaned.
- Fear of deleting "just in case".
- Incomplete refactorings.
- Lack of tools that flag unused code.

## Why it is a problem

- Noise that must be read and understood without adding anything.
- Useless code is still maintained, compiled and sometimes even "fixed".
- It can be reactivated by accident with outdated behavior.

## Example (smelly)

```go
func ShippingFee(order Order, legacy bool) float64 {
	const oldRate = 0.07 // SMELL: never used
	if order.Total >= 50 {
		return 0
	}
	return 4.95
	if legacy { // SMELL: unreachable
		return order.Total * oldRate
	}
	return 0
}

func formatLegacyInvoice(o Order) string { return "" } // SMELL: no callers
```

## Solution (refactored)

```go
func ShippingFee(order Order) float64 {
	if order.Total >= freeShippingThreshold {
		return 0
	}
	return standardFee
}
```

## Recommended refactorings

- **Remove Dead Code**: delete it; version control keeps it if it is ever needed.
- **Change Function Declaration**: removes unused parameters from signatures.
- **Inline Class**: or **Collapse Hierarchy** when what is dead is an entire abstraction.

## When it may be acceptable

- Public library APIs: the fact that the repository itself does not use a function does not mean its clients do not.
- Code invoked via reflection, dependency injection or frameworks (make sure before deleting).
- Parameters required by an interface or callback signature; name them with `_` to signal this.

## Related smells

- [Speculative Generality](speculative-generality.md) — unused speculative generality ends up as dead code.
- [Commented-Out Code](../09-comments/commented-out-code.md) — its commented-out variant.
- [Clutter](clutter.md) — unused variables and imports are clutter.
- [Lazy Class / Lazy Element](lazy-class.md) — a lazy class with no usages.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Ruff `F401` (unused import), `F841` (unused variable), `ARG001`/`ARG002` (unused arguments); Pylint `W0101 unreachable`, `W0612`, `W0613`; `vulture` for unused functions and classes. |
| C# | Compiler `CS0162` (unreachable code), `CS0168`/`CS0219` (unused variables); `IDE0051`/`IDE0052` (unused/unread private members), `IDE0060` (unused parameter); SonarQube `S1144`, `S1172`. |
| React + TS | ESLint `no-unreachable`, `@typescript-eslint/no-unused-vars`; `tsconfig` `noUnusedLocals`/`noUnusedParameters`/`allowUnreachableCode: false`; `knip` for unused exports and files. |
| Go | The compiler rejects unused imports and local variables; golangci-lint `unused`, `unparam`, `ineffassign`; `go vet` (`unreachable`). |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/dispensables/dead_code/`](../../../python/code_smells/dispensables/dead_code/) |
| C# | [`csharp/src/CodeSmells/Dispensables/DeadCode/`](../../../csharp/src/CodeSmells/Dispensables/DeadCode/) |
| React + TS | [`react-ts/src/smells/dispensables/dead-code/`](../../../react-ts/src/smells/dispensables/dead-code/) |
| Go | [`go/smells/dispensables/dead-code/`](../../../go/smells/dispensables/dead-code/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Dead Code: https://refactoring.guru/smells/dead-code
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
