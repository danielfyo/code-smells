# Loop Variable Capture

> **ID:** CS169 · **Category:** Go-specific · **Sources:** Go 1.22 release notes

## Definition

Capturing a `for` loop variable in a closure or taking its address (`&v`) to use it after the iteration, for example in
a goroutine. Up to Go 1.21 the variable was **a single one for the whole loop**, so every goroutine or pointer ended up
seeing the last value. Go 1.22 changed the semantics to one variable **per iteration**, but the smell persists in
modules declaring `go` < 1.22 and in "defensive" code that is no longer needed.

## Symptoms

- `for _, o := range orders { go func() { process(o) }() }` processing the last order N times (Go < 1.22).
- `ptrs = append(ptrs, &item)` leaving every pointer aimed at the same variable (Go < 1.22).
- In modern code: redundant copies `o := o` before the closure.

## Common causes

- Unfamiliarity with the pre-Go 1.22 semantics.
- Modules whose `go.mod` declares an old version, which keeps the old semantics even when built with a newer toolchain.

## Why it is a problem

- **Wrong results** that are hard to reproduce (they depend on scheduling).
- **Data races**: goroutines read a variable the loop is still writing.
- In Go ≥ 1.22, `x := x` copies are noise that confuses readers.

## How it works under the hood

A Go closure captures **variables, not values**: it keeps a reference to the variable and reads its contents when it
runs. Before Go 1.22, `for i, v := range xs` declared `i` and `v` once and reassigned them on each iteration; the
spawned goroutines usually ran after the loop had moved on, so all of them saw the last value. Since Go 1.22 (enabled
by a `go 1.22` or later line in `go.mod`), each iteration has its own variables, both in `range` loops and in
three-clause loops, so each closure captures a distinct variable.

## Example (smelly)

```go
// go.mod: go 1.21  (old semantics: one variable for the whole loop)
func NotifyAll(customers []Customer, send func(Customer)) {
	var wg sync.WaitGroup
	for _, c := range customers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			send(c) // SMELL: every goroutine may see the last customer
		}()
	}
	wg.Wait()
}
```

## Solution (refactored)

```go
// REFACTOR (a): go.mod with go 1.22+ → one variable per iteration; the same code is correct.

// REFACTOR (b): independent of the version, pass the value as an argument
func NotifyAll(customers []Customer, send func(Customer)) {
	var wg sync.WaitGroup
	for _, c := range customers {
		wg.Add(1)
		go func(c Customer) { // the parameter is each goroutine's own copy
			defer wg.Done()
			send(c)
		}(c)
	}
	wg.Wait()
}
// In modules already on Go 1.22+, remove leftover "c := c" copies.
```

## Recommended refactorings

- **Raise the `go` directive in `go.mod`** to 1.22 or later (verifying with tests and `-race`).
- **Pass the value as an argument** to the closure or goroutine in code that must compile with the old semantics.
- **Remove redundant copies** (`v := v`) after migrating.
- For pointers to elements, index the slice (`&items[i]`) when you mean to point at the real element.

## When it may be acceptable

- In Go ≥ 1.22, capturing the loop variable is correct and idiomatic: the smell only exists under the old semantics or
  when unnecessary copies are added.

## Related smells

- [Stale Closure / Missing Dependencies (React)](../16-react-ts/stale-closure.md) — another closure that does not see what you expect.
- [WaitGroup.Add inside Goroutine](./waitgroup-add-in-goroutine.md)
- [Concurrent Map Access without Sync](./unsynchronized-map.md)
- [Hidden Logical Dependency](../11-general/hidden-logical-dependency.md)

## Automatic detection

- **go vet** `loopclosure`: reports loop variables referenced by goroutines or `defer` (only in files using pre-1.22 semantics).
- **golangci-lint**: `copyloopvar` (flags unnecessary `v := v` copies in Go ≥ 1.22).
- **`go test -race`** for the resulting races.
- The Go team's `bisect` tool to locate failures caused by the semantics change.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/loop-variable-capture/`](../../../go/smells/go_specific/loop-variable-capture/)

## References

- Go Blog — *Fixing For Loops in Go 1.22*: https://go.dev/blog/loopvar-preview
- Go 1.22 release notes: https://go.dev/doc/go1.22
- Go FAQ — *What happens with closures running as goroutines?*: https://go.dev/doc/faq
- Teiva Harsanyi — *100 Go Mistakes* (#63 "Not being careful with goroutines and loop variables"): https://100go.co
