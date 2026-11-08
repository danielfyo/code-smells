# Goroutine Leak

> **ID:** CS159 · **Category:** Go-specific · **Sources:** Go Code Review Comments

## Definition

Starting goroutines that can block forever — waiting to send or receive on a channel nobody serves, or looping with no
exit condition — without any mechanism to stop them. Every leaked goroutine keeps its stack and everything it
references for as long as the process lives.

## Symptoms

- `runtime.NumGoroutine()` growing over time; memory climbing in long-running services.
- Sends on unbuffered channels whose receiver may have gone away (e.g. after a timeout).
- `go func() { for { … } }()` with no `select` on `ctx.Done()` or a stop channel.
- `pprof` goroutine profiles with thousands of entries on the same line (`chan send`, `chan receive`).

## Common causes

- "First response wins" or timeout patterns where the remaining goroutines cannot deliver their result.
- No ownership: nobody is responsible for stopping the goroutine.
- Ignoring `context.Context`.

## Why it is a problem

- **Memory and resource leaks** (connections, files) held by the goroutine.
- **Progressive degradation** until the service is restarted.
- Non-deterministic tests and interference between tests.

## How it works under the hood

The Go scheduler multiplexes goroutines onto OS threads; a goroutine blocked on a channel operation is parked and
uses no CPU, but it is **not collected**: the garbage collector cannot free a live goroutine even if it will never
wake up, because it cannot know that nobody will ever send or receive. A send on an unbuffered channel blocks until
there is a receiver. The fix is to give each goroutine a way to finish: a channel with enough buffer that sends never
block, or a `select` that also listens on `ctx.Done()`.

## Example (smelly)

```go
func FetchPrice(ctx context.Context, sku string) (float64, error) {
	ch := make(chan float64) // SMELL: unbuffered
	go func() {
		ch <- slowPriceLookup(sku) // blocks forever if nobody receives
	}()
	select {
	case p := <-ch:
		return p, nil
	case <-time.After(100 * time.Millisecond):
		return 0, errors.New("price lookup timeout") // the goroutine stays stuck
	}
}
```

## Solution (refactored)

```go
func FetchPrice(ctx context.Context, sku string) (float64, error) {
	ctx, cancel := context.WithTimeout(ctx, 100*time.Millisecond)
	defer cancel()

	ch := make(chan float64, 1) // REFACTOR: buffer of 1, the send never blocks
	go func() {
		ch <- slowPriceLookup(sku)
	}()
	select {
	case p := <-ch:
		return p, nil
	case <-ctx.Done():
		return 0, fmt.Errorf("price lookup %s: %w", sku, ctx.Err())
	}
}
// Better still: make slowPriceLookup accept ctx and stop working when it is cancelled.
```

## Recommended refactorings

- **Buffered channels** sized to the number of senders when the receiver may give up.
- **Propagate `context.Context`** and `select` on `ctx.Done()` in loops and sends.
- **Define ownership**: whoever starts the goroutine knows how and when it ends (`errgroup.Group`, `sync.WaitGroup`).
- Close channels from the sender so the receiver's `range` loops terminate.

## When it may be acceptable

- Background goroutines that live as long as the process (a metrics server, a global ticker), documented as such.

## Related smells

- [Missing Context Propagation](./missing-context.md)
- [time.After in Loops](./time-after-in-loop.md)
- [WaitGroup.Add inside Goroutine](./waitgroup-add-in-goroutine.md)
- [Missing Effect Cleanup (React)](../16-react-ts/missing-effect-cleanup.md) — the same orphaned-resource problem.

## Automatic detection

- **goleak** (Uber): `goleak.VerifyNone(t)` or `goleak.VerifyTestMain(m)` fail tests if goroutines are left running.
- **go vet** `lostcancel`: flags context `cancel` functions that are never called.
- `net/http/pprof` and `runtime.NumGoroutine()` in production.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/goroutine-leak/`](../../../go/smells/go_specific/goroutine-leak/)

## References

- Go Code Review Comments — *Goroutine Lifetimes*: https://go.dev/wiki/CodeReviewComments
- Go Blog — *Go Concurrency Patterns: Pipelines and cancellation*: https://go.dev/blog/pipelines
- goleak: https://github.com/uber-go/goleak
- Teiva Harsanyi — *100 Go Mistakes* (#62 "Starting a goroutine without knowing when to stop it"): https://100go.co
