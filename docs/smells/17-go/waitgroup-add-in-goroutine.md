# WaitGroup.Add inside Goroutine

> **ID:** CS174 · **Category:** Go-specific · **Sources:** 100 Go Mistakes #71

## Definition

Calling `wg.Add(1)` inside the goroutine being started instead of before the `go` statement. Between the launch and
the execution of `Add` there is a window in which `wg.Wait()` may find the counter at zero and return early, leaving
work unawaited.

## Symptoms

- `go func() { wg.Add(1); defer wg.Done(); … }()`.
- Intermittently incomplete results (missing elements in a slice, a lower total than expected).
- `go test -race` failures or tests that only fail sometimes, more often under load or with a high `-count`.

## Common causes

- Putting `Add` and `Done` "together" for visual symmetry.
- Not realising that a goroutine may not start running until long after the `go` statement.

## Why it is a problem

- **`Wait` returns too early**: partial results are read.
- **Panics** (e.g. "sync: WaitGroup is reused before previous Wait has returned" or a negative counter) in more complex uses.
- **Data races** on results the goroutines are still writing.

## How it works under the hood

The `go f()` statement only **schedules** the goroutine; the scheduler decides when to run it, possibly after the
parent goroutine has reached `wg.Wait()`. `Wait` blocks while the counter is greater than zero; if no goroutine has run
its `Add` yet, the counter is zero and `Wait` returns immediately. The `sync.WaitGroup` documentation requires calls
to `Add` with a positive delta to happen **before** `Wait`, i.e. before the `go` statement. Go 1.25 adds `wg.Go(f)`,
which performs `Add` and `Done` correctly by construction.

## Example (smelly)

```go
func PriceAll(skus []string, price func(string) float64) []float64 {
	var (
		wg  sync.WaitGroup
		mu  sync.Mutex
		out []float64
	)
	for _, sku := range skus {
		go func() {
			wg.Add(1) // SMELL: races with wg.Wait()
			defer wg.Done()
			p := price(sku)
			mu.Lock()
			out = append(out, p)
			mu.Unlock()
		}()
	}
	wg.Wait() // may return with out incomplete
	return out
}
```

## Solution (refactored)

```go
func PriceAll(skus []string, price func(string) float64) []float64 {
	out := make([]float64, len(skus))
	var wg sync.WaitGroup
	wg.Add(len(skus)) // REFACTOR: Add before starting the goroutines
	for i, sku := range skus {
		go func() {
			defer wg.Done()
			out[i] = price(sku) // disjoint indexes: no mutex needed
		}()
	}
	wg.Wait()
	return out
}
// With errors: golang.org/x/sync/errgroup (g.Go + g.Wait). With Go 1.25+: wg.Go(func() { … }).
```

## Recommended refactorings

- **Move `wg.Add` before the `go` statement** (or a single `wg.Add(n)` before the loop).
- **`errgroup.Group`** when tasks can fail or must be cancelled.
- **`sync.WaitGroup.Go`** (Go 1.25+), which encapsulates the correct pattern.
- Write into disjoint indexes of a preallocated slice instead of `append` with a mutex.

## When it may be acceptable

- Never for a goroutine's own work. A goroutine may call `Add` for **other** goroutines it starts itself, as long as
  the counter is already positive (because it is itself counted) when it does so.

## Related smells

- [Goroutine Leak](./goroutine-leak.md)
- [Loop Variable Capture](./loop-variable-capture.md)
- [Concurrent Map Access without Sync](./unsynchronized-map.md)
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md)

## Automatic detection

- **staticcheck**: `SA2000` ("sync.WaitGroup.Add called inside the goroutine, leading to a race condition").
- **`go test -race`** and repeated runs (`-count=100`) to surface the race.
- Recent **go vet** versions (Go 1.25) include a `waitgroup` analyser for this pattern.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/waitgroup-add-in-goroutine/`](../../../go/smells/go_specific/waitgroup-add-in-goroutine/)

## References

- Package `sync` (`WaitGroup`): https://pkg.go.dev/sync
- Package `errgroup`: https://pkg.go.dev/golang.org/x/sync/errgroup
- Teiva Harsanyi — *100 Go Mistakes* (#71 "Misusing sync.WaitGroup"): https://100go.co
