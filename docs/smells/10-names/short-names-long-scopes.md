# Short Names for Long Scopes

> **ID:** CS060 · **Category:** Names · **Sources:** Clean Code N5

*Single-letter names used in wide scopes or with long lifetimes.*

## Definition

A very short name (one or two letters) used in a wide scope: a class field, a package-level variable or a
local variable that lives for dozens of lines. *Clean Code* (N5, *Use Long Names for Long Scopes*) proposes
that name length should be proportional to scope size: `i` is perfect in a three-line loop and unacceptable
in a fifty-line method.

## Symptoms

- Variables `c`, `p`, `t` declared at the top of a long function and used much further down.
- Class fields or global variables with single-letter names.
- Short receivers or parameters in long functions where their meaning gets lost.
- Having to scroll up to remember what `r` was.

## Common causes

- Functions that started short and grew without renaming their variables.
- Misreading the conventions of languages that favor short names (Go).

## Why it is a problem

- **Loss of context**: the farther away the declaration, the harder it is to remember what it means.
- **Confusion** between similar short variables in the same scope.
- Searching is impossible: searching for `c` in a file does not help.

## Example (smelly)

```python
class ReportBuilder:
    def __init__(self, c, r):
        self.c = c   # SMELL: long-lived attribute with a single-letter name
        self.r = r

    def build(self):
        # ... 40 lines later ...
        for o in self.r.orders_for(self.c.id):
            ...
```

## Solution (refactored)

```python
class ReportBuilder:
    def __init__(self, customer: Customer, repository: OrderRepository):
        # REFACTOR: names proportional to their scope (the whole object lifetime)
        self.customer = customer
        self.repository = repository

    def build(self) -> Report:
        orders = self.repository.orders_for(self.customer.id)
        return Report(lines=[line_for(o) for o in orders])  # 'o' is fine in a one-line scope
```

## Recommended refactorings

- **Rename Variable / Rename Field** with descriptive names.
- **Extract Function** to shrink the scope, so that short names become acceptable again.
- **Slide Statements** to declare variables close to their use.

## When it may be acceptable

- Loops and lambdas a few lines long (`for i in range(n)`, `items.map(x => x.id)`).
- Idiomatic Go conventions: short receivers (`func (o *Order)`), `err`, `ctx`, `w http.ResponseWriter`, `r *http.Request`.
- Mathematical or scientific notation where the letter is the standard name.

## Related smells

- [Mysterious / Uncommunicative Name](uncommunicative-name.md): the general case.
- [Vertical Separation](../11-general/vertical-separation.md): the distance between declaration and use makes it worse.
- [Long Method](../01-bloaters/long-method.md): long methods create long scopes.
- [Global Data](../05-couplers/global-data.md): global variables have the longest possible scope.

## Automatic detection

- **Go**: golangci-lint's `varnamelen` linter relates name length to usage distance, exactly this smell.
- **TypeScript**: ESLint `id-length` (with configurable exceptions such as `i`, `_`).
- **Python**: Pylint `C0103` (`invalid-name`) with minimum-length regular expressions for attributes and arguments; Ruff `E741`.
- **C#**: `.editorconfig` naming rules (`IDE1006`) and SonarQube naming convention rules for fields and variables.

## Implementations

- Python: [`python/code_smells/names/short_names_long_scopes/`](../../../python/code_smells/names/short_names_long_scopes/)
- C#: [`csharp/src/CodeSmells/Names/ShortNamesLongScopes/`](../../../csharp/src/CodeSmells/Names/ShortNamesLongScopes/)
- React + TS: [`react-ts/src/smells/names/short-names-long-scopes/`](../../../react-ts/src/smells/names/short-names-long-scopes/)
- Go: [`go/smells/names/short-names-long-scopes/`](../../../go/smells/names/short-names-long-scopes/)
- Angular: [`angular/src/smells/names/short-names-long-scopes/`](../../../angular/src/smells/names/short-names-long-scopes/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 2 "Meaningful Names". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
