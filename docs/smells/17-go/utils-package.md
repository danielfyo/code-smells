# utils / common Packages

> **ID:** CS172 · **Category:** Go-specific · **Sources:** Dave Cheney; Go blog: Package names

## Definition

Packages with generic names such as `utils`, `util`, `common`, `helpers`, `misc`, `shared` or `base` that accumulate
unrelated functions. The name does not say what the package provides, only that "nobody knew where to put it", and
over time it becomes a junk drawer that every other package depends on.

## Symptoms

- `utils.FormatPrice`, `utils.ParseDate`, `utils.Retry`, `utils.HashPassword` in the same package.
- Many packages import `common`, and `common` imports more and more things.
- Import cycles that force code to be moved "into common".
- Long function names because the package adds no context (`utils.StringSliceContains`).

## Common causes

- Extracting duplicated code without thinking about its domain.
- Organising by technical kind rather than by responsibility.
- Breaking import cycles by moving code into a neutral package.

## Why it is a problem

- **Low cohesion**: the package changes for very different reasons.
- **Coupling**: a package everyone depends on makes any change ripple everywhere.
- **Poor names** at call sites: `utils.X` tells you nothing.
- Code is hard to find, which encourages duplication ("I didn't know it was in `helpers`").

## How it works under the hood

In Go the package name appears at every use of its identifiers (`strings.Contains`, `time.Parse`), so it is part of
the calling code's documentation. A good package name describes **what it provides**, not what it contains. Go also
forbids import cycles; a generic package tends to become the hub of the dependency graph. Small packages with domain
names (`money`, `retry`, `password`) keep the graph clean and allow short names inside them (`money.Format`,
`retry.Do`).

## Example (smelly)

```go
package utils // SMELL: meaningless name, heterogeneous contents

func FormatEuros(cents int64) string { return fmt.Sprintf("%.2f EUR", float64(cents)/100) }

func ContainsString(xs []string, s string) bool { /* … */ return false }

func HashPassword(pw string) (string, error) { /* bcrypt … */ return "", nil }

func Retry(n int, f func() error) error { /* … */ return nil }

// Usage: utils.FormatEuros(o.Total), utils.HashPassword(pw), utils.Retry(3, call)
```

## Solution (refactored)

```go
// REFACTOR: Move Function into cohesive packages with domain names

// package money
func Format(cents int64) string { return fmt.Sprintf("%.2f EUR", float64(cents)/100) }

// package password
func Hash(pw string) (string, error) { /* bcrypt … */ return "", nil }

// package retry
func Do(attempts int, f func() error) error { /* … */ return nil }

// ContainsString disappears: slices.Contains from the standard library (Go 1.21+).

// Usage: money.Format(o.Total), password.Hash(pw), retry.Do(3, call), slices.Contains(xs, s)
```

## Recommended refactorings

- **Move Function**: move each utility to the domain package that uses it, or to a new package with its own name.
- **Replace utilities with the standard library** (`slices`, `maps`, `strings`, `cmp`).
- **Inline** one-line functions used only once.
- Break import cycles with consumer-side interfaces, not with a neutral package.

## When it may be acceptable

- `internal/testutil` or similar packages, limited to tests and with a clear purpose.
- Very small, early-stage projects with an explicit intention to reorganise.

## Related smells

- [Large Class / God Class](../01-bloaters/large-class.md)
- [Divergent Change](../03-change-preventers/divergent-change.md)
- [Uncommunicative Name](../10-names/uncommunicative-name.md)
- [Stuttering Names](./stuttering-names.md)
- [Misplaced Responsibility](../11-general/misplaced-responsibility.md)

## Automatic detection

- **revive**: recent versions of the `var-naming` rule include checks for meaningless package names; otherwise, ban
  them with custom rules.
- Dependency analysis tools (`go list -deps`, dependency-graph visualisers) reveal packages with too many importers.
- Code review: any package named `utils`, `common`, `helpers`, `misc`, `base` or `shared`.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/utils-package/`](../../../go/smells/go_specific/utils-package/)

## References

- Go Blog — *Package names* ("Bad package names"): https://go.dev/blog/package-names
- Go Code Review Comments — *Package Names*: https://go.dev/wiki/CodeReviewComments
- Dave Cheney — *Avoid package names like base, util, or common* (2019): https://dave.cheney.net
- Teiva Harsanyi — *100 Go Mistakes* (#13 "Creating utility packages"): https://100go.co
