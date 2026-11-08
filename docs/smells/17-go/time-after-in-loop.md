# time.After in Loops

> **ID:** CS173 · **Category:** Go-specific · **Sources:** 100 Go Mistakes #76

## Definition

Using `time.After(d)` inside a `select` within a loop (`for { select { case m := <-ch: …; case <-time.After(d): … } }`).
Every iteration creates a **new timer** with its own channel. Before Go 1.23 those timers were not released until they
fired, causing memory growth; even today the pattern allocates on every iteration and usually expresses different
semantics from what was intended.

## Symptoms

- `case <-time.After(...)` inside a `for`/`select` that processes messages frequently.
- Growing memory in queue consumers with long timeouts (Go < 1.23).
- A "global timeout" that actually restarts on every message and never fires.

## Common causes

- Convenience: `time.After` is a single expression.
- Copying the pattern from a one-off `select` (correct) into a loop.

## Why it is a problem

- **Memory** (Go < 1.23): with a 1-hour timeout and thousands of messages per second, millions of live timers.
- **Unnecessary allocations** on every iteration (also in Go ≥ 1.23).
- **Confusing semantics**: it measures inactivity between messages, not total time; often not what was intended.

## How it works under the hood

`time.After(d)` is equivalent to `time.NewTimer(d).C`: it creates a `Timer` registered with the runtime and returns only
its channel, so there is no way to stop it. Up to Go 1.22 the runtime kept the timer referenced until it fired, so the
garbage collector could not free it even if nobody read its channel any more. Go 1.23 changed this (for modules
declaring `go 1.23` or later): unreferenced timers can be collected even if they were not stopped. Still, reusing a
single `Timer` with `Reset`, or using `context.WithTimeout` for an overall deadline, avoids work and makes the intent
explicit.

## Example (smelly)

```go
func ConsumeOrders(ch <-chan Order, handle func(Order)) error {
	for {
		select {
		case o, ok := <-ch:
			if !ok {
				return nil
			}
			handle(o)
		case <-time.After(30 * time.Minute): // SMELL: a new timer per iteration
			return errors.New("no orders received for 30m")
		}
	}
}
```

## Solution (refactored)

```go
const idleTimeout = 30 * time.Minute

func ConsumeOrders(ctx context.Context, ch <-chan Order, handle func(Order)) error {
	idle := time.NewTimer(idleTimeout) // REFACTOR: a single reused timer
	defer idle.Stop()
	for {
		select {
		case o, ok := <-ch:
			if !ok {
				return nil
			}
			handle(o)
			idle.Reset(idleTimeout) // Go 1.23+: Reset is safe without draining the channel
		case <-idle.C:
			return fmt.Errorf("no orders received for %s", idleTimeout)
		case <-ctx.Done(): // overall deadline or cancellation: the context's job
			return ctx.Err()
		}
	}
}
```

## Recommended refactorings

- **One `time.NewTimer` outside the loop** with `Reset` per iteration (inactivity timeout).
- **`context.WithTimeout`/`WithDeadline`** for an overall deadline.
- **`time.NewTicker`** (with `defer t.Stop()`) for periodic work, instead of `time.After` or `time.Tick` in a loop.
- Keep `go.mod` at version 1.23 or later to benefit from the new timer semantics.

## When it may be acceptable

- One-off `select` statements outside loops (`select { case r := <-res: …; case <-time.After(2*time.Second): … }`).
- Low-frequency loops with short timeouts in Go ≥ 1.23 modules, where the cost is negligible.

## Related smells

- [Goroutine Leak](./goroutine-leak.md)
- [defer in Loop](./defer-in-loop.md)
- [Missing Context Propagation](./missing-context.md)
- [Magic Numbers](../06-data/magic-numbers.md)

## Automatic detection

- **staticcheck**: `SA1015` (using `time.Tick` in a way that may leak; an analogous case).
- There is no widely adopted standard rule for `time.After` in loops; rely on code review and memory profiles
  (`pprof`, `runtime/metrics`).

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/time-after-in-loop/`](../../../go/smells/go_specific/time-after-in-loop/)

## References

- Package `time` (`After`, `NewTimer`, `Timer.Reset`): https://pkg.go.dev/time
- Go 1.23 release notes (timer changes): https://go.dev/doc/go1.23
- Teiva Harsanyi — *100 Go Mistakes* (#76 "time.After and memory leaks"): https://100go.co
