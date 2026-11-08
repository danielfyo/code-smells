# Commented-Out Code

> **ID:** CS055 · **Category:** Comments · **Sources:** Clean Code C5

*Blocks of commented-out code nobody dares to delete; that is what version control is for.*

## Definition

Blocks of code disabled with comments and left behind in the file. Nobody knows whether they matter, whether
they work or why they are there, so nobody dares to delete them and they pile up. *Clean Code* (C5,
*Commented-Out Code*) is blunt: delete them; the version control system remembers them.

## Symptoms

- Lines or whole functions prefixed with `#` or `//`, or wrapped in `/* ... */`.
- Commented-out code referencing variables or APIs that no longer exist.
- Comments like `// old version, in case we need to go back`.
- `if False:` or `if (false)` blocks serving the same purpose.

## Common causes

- Fear of losing work or of needing it "later".
- Quick debugging or experiments not cleaned up before committing.
- Distrust of version control or not knowing how to recover old code.

## Why it is a problem

- **Noise and confusion**: readers wonder whether the commented code describes the desired behavior.
- **It rots**: it stops compiling as the rest evolves, so restoring it rarely works.
- It shows up in searches and reviews, diverting attention.

## Example (smelly)

```go
func (s *CartService) Total(c Cart) Money {
    total := Money(0)
    for _, it := range c.Items {
        total += it.Price * Money(it.Qty)
        // if it.Category == "promo" {
        //     total -= it.Price / 10
        // }
    }
    // total = applyLegacyTax(total) // still used?
    // SMELL: dead commented-out code nobody dares to delete
    return total
}
```

## Solution (refactored)

```go
func (s *CartService) Total(c Cart) Money {
    total := Money(0)
    for _, it := range c.Items {
        total += it.Price * Money(it.Qty)
    }
    // REFACTOR: the old code lives in the git history
    return total
}
```

## Recommended refactorings

- **Remove Dead Code**: delete it and, if useful, mention it in the commit message.
- If the alternative behavior is needed, **Parameterize Function** or use an explicit feature flag instead of commenting it out.
- Turn experiments into separate branches or spikes.

## When it may be acceptable

- Usage examples inside documentation (doctests, example blocks in docstrings or XML docs).
- During a local working session, as long as it does not reach the main branch.
- Code temporarily disabled with a link to an issue and a clear expiry (preferably through a feature flag).

## Related smells

- [Dead Code](../04-dispensables/dead-code.md): commented-out code is visible dead code.
- [Inappropriate Information](inappropriate-information.md): another use of source code as a substitute for version control.
- [Clutter](../04-dispensables/clutter.md): noise that gets in the way of reading.
- [Speculative Generality](../04-dispensables/speculative-generality.md): kept "just in case".

## Automatic detection

- **Python**: Ruff `ERA001` (eradicate, commented-out code).
- **C#**: SonarQube `S125` (*Sections of code should not be commented out*).
- **TypeScript**: `eslint-plugin-sonarjs` includes a commented-out code rule (`no-commented-code`); SonarQube `S125` for JS/TS.
- **Go**: `gocritic`'s `commentedOutCode` checker (via golangci-lint).

## Implementations

- Python: [`python/code_smells/comments/commented_out_code/`](../../../python/code_smells/comments/commented_out_code/)
- C#: [`csharp/src/CodeSmells/Comments/CommentedOutCode/`](../../../csharp/src/CodeSmells/Comments/CommentedOutCode/)
- React + TS: [`react-ts/src/smells/comments/commented-out-code/`](../../../react-ts/src/smells/comments/commented-out-code/)
- Go: [`go/smells/comments/commented-out-code/`](../../../go/smells/comments/commented-out-code/)
- Angular: [`angular/src/smells/comments/commented-out-code/`](../../../angular/src/smells/comments/commented-out-code/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 4 "Comments". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
