# Non-Standard Nomenclature

> **ID:** CS058 · **Category:** Names · **Sources:** Clean Code N3

*Ignoring well-known pattern names and the conventions of the language and domain.*

## Definition

The code ignores standard names any developer already knows: design pattern names (`Factory`, `Decorator`,
`Visitor`), language conventions (`snake_case` in Python, `PascalCase` methods in C#, `MixedCaps` in Go, the
`use` prefix for React hooks) or the ubiquitous language of the domain. *Clean Code* (N3, *Use Standard
Nomenclature Where Possible*) recommends leaning on those names because they convey a lot of information with
little effort.

## Symptoms

- Well-known patterns under invented names (`OrderMaker` for a factory, `Wrapper2` for a decorator).
- Capitalization styles from another language (`getOrderTotal` in Python, `get_total` in C#).
- React hooks that do not start with `use`, or lowercase components.
- Business terms that differ from those used by domain experts (`ticket` where the business says `invoice`).

## Common causes

- Developers coming from other languages bringing their habits along.
- Unfamiliarity with patterns or with the language style guide (PEP 8, .NET guidelines, *Effective Go*).
- No domain glossary shared with the business.

## Why it is a problem

- **Higher cognitive load**: readers fail to recognize structures they already know.
- **Confused tools**: React's hooks rules and other analyzers depend on conventions.
- Friction between the technical team and the business when names do not match the ubiquitous language.

## Example (smelly)

```tsx
// SMELL: a hook without the "use" prefix and a factory with an invented name
function cartState(initial: Item[]) {
  const [items, setItems] = useState(initial);
  return { items, add: (i: Item) => setItems([...items, i]) };
}

class InvoiceMaker2 {
  static make(kind: string): Invoice { /* ... */ }
}
```

## Solution (refactored)

```tsx
// REFACTOR: hook convention (React's lint rules can now check it)
function useCart(initial: Item[]) {
  const [items, setItems] = useState(initial);
  return { items, add: (item: Item) => setItems((prev) => [...prev, item]) };
}

// REFACTOR: standard name of the Factory pattern
class InvoiceFactory {
  static create(kind: InvoiceKind): Invoice { /* ... */ }
}
```

## Recommended refactorings

- **Rename (Rename Variable / Rename Field / Change Function Declaration)** following the language style guide.
- Adopt the **pattern name** when the code implements it (Kerievsky, *Refactoring to Patterns*).
- Maintain a **domain glossary** (ubiquitous language) and align names with it.

## When it may be acceptable

- Code integrating with external systems whose names are kept on purpose (legacy database columns, JSON API fields).
- When the pattern name would mislead because the implementation only superficially resembles it.

## Related smells

- [Inconsistent Names](inconsistent-names.md): different conventions for the same thing within the project.
- [Oddball Solution](../11-general/oddball-solution.md): solving in a different way what already has a standard form.
- [Java-style Getters and Setters](../14-python/java-style-getters-setters.md): bringing Java conventions into Python.
- [Getters with Get Prefix](../17-go/get-prefix-getters.md): a convention foreign to Go style.
- [Stuttering Names](../17-go/stuttering-names.md): another Go naming convention.

## Automatic detection

- **Python**: Pylint `C0103` (`invalid-name`) and `C0104` (`disallowed-name`, configurable list such as `foo`, `tmp`, `data`); Ruff `N8xx` (pep8-naming) and `E741` (ambiguous names `l`, `O`, `I`).
- **C#**: `IDE1006` (`.editorconfig` naming rules), `CA1707`, `CA1715`, `CA1720`; SonarQube naming rules (`S100`, `S101`, `S117`).
- **TypeScript/React**: `eslint-plugin-react-hooks` (`rules-of-hooks` relies on the `use` prefix), `@typescript-eslint/naming-convention`, `react/jsx-pascal-case`.
- **Go**: `revive` (`var-naming`, `receiver-naming`), `stylecheck`/staticcheck `ST1003` and `varnamelen` in golangci-lint. `revive` also flags underscores and similar issues in exported names.

## Implementations

- Python: [`python/code_smells/names/non_standard_nomenclature/`](../../../python/code_smells/names/non_standard_nomenclature/)
- C#: [`csharp/src/CodeSmells/Names/NonStandardNomenclature/`](../../../csharp/src/CodeSmells/Names/NonStandardNomenclature/)
- React + TS: [`react-ts/src/smells/names/non-standard-nomenclature/`](../../../react-ts/src/smells/names/non-standard-nomenclature/)
- Go: [`go/smells/names/non-standard-nomenclature/`](../../../go/smells/names/non-standard-nomenclature/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 2 "Meaningful Names". Prentice Hall.
- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
