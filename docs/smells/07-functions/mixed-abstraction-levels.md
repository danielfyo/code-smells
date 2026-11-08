# Mixed Levels of Abstraction

> **ID:** CS044 · **Category:** Functions & Conditional Logic · **Sources:** Clean Code G6/G34
>
> A function mixes low-level details with high-level operations.

## Definition

**Mixed levels of abstraction** occur when a function combines high-level operations (business concepts:
"register the customer", "invoice the order") with low-level details (concatenating strings, opening
connections, parsing bytes). *Clean Code* covers this in G6 (code at the wrong level of abstraction) and
G34 (functions should descend only one level of abstraction), and in chapter 3's "stepdown rule".

The reader has to jump continually between the "what" and the "how" and cannot tell the essential from
the incidental.

## Symptoms

- Functions where one line is `notify_customer(order)` and the next builds an SQL query by hand.
- Calls to domain services mixed with string, file or socket manipulation.
- Base classes or interfaces that include concrete implementation details.
- Difficulty explaining the function in one sentence without mentioning technical details.

## Common causes

- Writing code as you think it, step by step, without reorganizing.
- Extending high-level functions with details "because it's just one line".
- No clear layers (domain, application, infrastructure).

## Why it is a problem

- It makes the function's intent hard to understand.
- Low-level details get duplicated in other high-level functions.
- Changing a technical detail forces you to touch business logic.

## Example (smelly)

```go
func RegisterCustomer(db *sql.DB, c Customer) error {
	if err := validate(c); err != nil {
		return err
	}
	// SMELL: low-level details in the middle of the business flow
	email := strings.ToLower(strings.TrimSpace(c.Email))
	_, err := db.Exec("INSERT INTO customers(name, email) VALUES ($1, $2)", c.Name, email)
	if err != nil {
		return fmt.Errorf("insert: %w", err)
	}
	return sendWelcome(c)
}
```

## Solution (refactored)

```go
func RegisterCustomer(repo CustomerRepository, c Customer) error {
	if err := validate(c); err != nil {
		return err
	}
	c.Email = normalizeEmail(c.Email)
	if err := repo.Save(c); err != nil {
		return err
	}
	return sendWelcome(c)
}

func normalizeEmail(s string) string { return strings.ToLower(strings.TrimSpace(s)) }
```

The main function stays at a single level of abstraction; the SQL lives in the `CustomerRepository` implementation.

## Recommended refactorings

- **Extract Function**: moves each low-level detail into a function named at the right level.
- **Move Function**: relocates technical details to the layer they belong to (repositories, adapters).
- **Split Phase**: separates data preparation from its processing.
- **Compose Method**: from Kerievsky: the function becomes a sequence of steps at the same level.

## When it may be acceptable

- Very low-level functions whose purpose is precisely the technical detail.
- Short, single-use scripts.

## Related smells

- [Long Method](../01-bloaters/long-method.md) — mixing levels makes methods longer.
- [Divergent Change](../03-change-preventers/divergent-change.md) — mixing layers makes the function change for different reasons.
- [Names at Wrong Abstraction Level](../10-names/wrong-abstraction-level-name.md) — names that do not match the level of abstraction.
- [Business Logic in Components](../16-react-ts/business-logic-in-components.md) — in React, business logic mixed with presentation.
- [Comments (as deodorant)](../04-dispensables/excessive-comments.md) — section comments often separate mixed levels.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No direct rule; `import-linter` prevents domain layers from importing infrastructure; complexity metrics provide hints. |
| C# | No direct rule; ArchUnitNET or NDepend for layer rules; SonarQube `S3776` as a hint. |
| React + TS | No direct rule; `dependency-cruiser` or `eslint-plugin-boundaries` for layer rules. |
| Go | No specific linter; `depguard` to prevent infrastructure imports in domain packages. |

Detection is fundamentally semantic; architecture rules prevent the most serious version (domain importing infrastructure).

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/functions/mixed_abstraction_levels/`](../../../python/code_smells/functions/mixed_abstraction_levels/) |
| C# | [`csharp/src/CodeSmells/Functions/MixedAbstractionLevels/`](../../../csharp/src/CodeSmells/Functions/MixedAbstractionLevels/) |
| React + TS | [`react-ts/src/smells/functions/mixed-abstraction-levels/`](../../../react-ts/src/smells/functions/mixed-abstraction-levels/) |
| Go | [`go/smells/functions/mixed-abstraction-levels/`](../../../go/smells/functions/mixed-abstraction-levels/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
