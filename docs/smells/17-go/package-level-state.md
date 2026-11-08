# Mutable Package-level State

> **ID:** CS163 · **Category:** Go-specific · **Sources:** Dave Cheney

## Definition

Variables declared at package level (`var cache = map[string]User{}`, `var currentTenant string`) that are modified at
runtime. They are Go's version of [Global Data](../05-couplers/global-data.md): any function in the package — and
sometimes outside it — can read and write them without the signatures showing it.

## Symptoms

- Tests that cannot use `t.Parallel()` or fail depending on execution order.
- "Reset" functions exported only for tests (`ResetForTest()`).
- `go test -race` failures on global variables.
- Parameterless functions whose result changes between calls.

## Common causes

- Convenience: avoiding passing dependencies around.
- Singletons ported from other languages.
- Initialisation in `init()` (see [init() Abuse](./init-abuse.md)).

## Why it is a problem

- **Coupled tests**: they share state and cannot run in parallel.
- **Race conditions** when several goroutines access it without synchronisation.
- **Hidden dependencies**: the signature does not show what state a function reads or writes.
- **No multiple instances**: you cannot have two configurations at once (e.g. two tenants).

## How it works under the hood

A package-level variable exists once per process and lives for the whole run. Every goroutine shares it; the Go memory
model does not guarantee that a write is visible to another goroutine without synchronisation (mutex, channel,
`sync/atomic`), and concurrent unsynchronised access is a data race with undefined behaviour. Tests in a package run in
the same process, so one test's state leaks into the next. Encapsulating the state in a struct passed as a dependency
creates independent instances per test or per request.

## Example (smelly)

```go
package pricing

var discountRate = 0.0                    // SMELL: mutable global state
var cache = map[string]float64{}          // SMELL: shared across goroutines and tests

func SetDiscount(r float64) { discountRate = r }

func FinalPrice(sku string, base float64) float64 {
	if p, ok := cache[sku]; ok {          // data race with concurrent writes
		return p
	}
	p := base * (1 - discountRate)
	cache[sku] = p
	return p
}
```

## Solution (refactored)

```go
package pricing

// REFACTOR: Encapsulate Global into an injected struct
type Calculator struct {
	discountRate float64
	mu           sync.Mutex
	cache        map[string]float64
}

func NewCalculator(discountRate float64) *Calculator {
	return &Calculator{discountRate: discountRate, cache: map[string]float64{}}
}

func (c *Calculator) FinalPrice(sku string, base float64) float64 {
	c.mu.Lock()
	defer c.mu.Unlock()
	if p, ok := c.cache[sku]; ok {
		return p
	}
	p := base * (1 - c.discountRate)
	c.cache[sku] = p
	return p
}
// Each test creates its own Calculator and can run with t.Parallel().
```

## Recommended refactorings

- **Encapsulate state in a struct** with a constructor and pass it as a dependency.
- **Inject configuration** from `main` instead of reading it from globals.
- Synchronise with `sync.Mutex`/`sync/atomic` any state that truly must be shared.
- If a lazy global value is unavoidable, use `sync.OnceValue` and keep it immutable once created.

## When it may be acceptable

- Values immutable after initialisation: sentinel errors (`var ErrNotFound = errors.New(...)`), lookup tables,
  compiled regular expressions.
- Standard-library registries (`http.DefaultServeMux`, `expvar`), with care.

## Related smells

- [Global Data](../05-couplers/global-data.md)
- [Mutable Data](../06-data/mutable-data.md)
- [init() Abuse](./init-abuse.md)
- [Concurrent Map Access without Sync](./unsynchronized-map.md)
- [Interdependent Tests](../12-tests/interdependent-tests.md)

## Automatic detection

- **golangci-lint**: `gochecknoglobals` (global variables, with exceptions for sentinel errors).
- **`go test -race`**: detects unsynchronised concurrent accesses.
- Running tests with `t.Parallel()` and `-shuffle=on` surfaces dependencies between tests.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/package-level-state/`](../../../go/smells/go_specific/package-level-state/)

## References

- Dave Cheney — *Go without package scoped variables* (2017) and *Practical Go*: https://dave.cheney.net
- The Go Memory Model: https://go.dev/ref/mem
- Go — *Data Race Detector*: https://go.dev/doc/articles/race_detector
- Uber Go Style Guide — *Avoid Mutable Globals*: https://github.com/uber-go/guide/blob/master/style.md
