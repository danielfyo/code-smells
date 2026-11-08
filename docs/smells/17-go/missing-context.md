# Missing Context Propagation

> **ID:** CS160 · **Category:** Go-specific · **Sources:** Go blog: Context

## Definition

Functions that perform I/O or potentially long work (database queries, HTTP calls, waits) without accepting or
propagating a `context.Context`, or that create `context.Background()` halfway down the call chain. As a result, the
caller's cancellation and deadlines never reach the actual operations.

## Symptoms

- `http.Get(url)`, `db.Query(...)` instead of `http.NewRequestWithContext` or `db.QueryContext(ctx, ...)`.
- `context.Background()` or `context.TODO()` inside functions other than `main`, tests or initialisation.
- HTTP handlers that keep querying the database after the client has disconnected.
- `context.WithTimeout` whose `cancel` is never called.

## Common causes

- Code written before the library API accepted a context.
- Seeing the context parameter as signature "noise".
- Not realising the context also carries deadlines.

## Why it is a problem

- **No cancellation**: useless work keeps consuming resources after the request is abandoned.
- **No timeouts**: a slow dependency blocks goroutines indefinitely (see [Goroutine Leak](./goroutine-leak.md)).
- **Cascading failures** in distributed systems when end-to-end deadlines are not honoured.

## How it works under the hood

A `context.Context` is an immutable tree: `WithCancel`, `WithTimeout` and `WithDeadline` create children that are
cancelled when the parent is cancelled or their deadline expires. `ctx.Done()` returns a channel that is closed at that
moment, and `ctx.Err()` reports why (`context.Canceled` or `context.DeadlineExceeded`). Standard libraries
(`net/http`, `database/sql`) listen on that channel to abort operations. Creating `context.Background()` midway cuts the
tree: the operation is disconnected from the caller's cancellation. Each `With…` holds resources until its `cancel` is
called, hence `defer cancel()`.

## Example (smelly)

```go
func (s *OrderService) Report(customerID string) ([]Order, error) { // SMELL: no ctx
	rows, err := s.db.Query( // SMELL: not cancellable
		"SELECT id, total FROM orders WHERE customer_id = $1", customerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	rate, err := s.fx.Rate(context.Background(), "EUR") // SMELL: cuts the tree
	if err != nil {
		return nil, err
	}
	return scanOrders(rows, rate)
}
```

## Solution (refactored)

```go
// REFACTOR: ctx as the first parameter, propagated to every operation
func (s *OrderService) Report(ctx context.Context, customerID string) ([]Order, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	rows, err := s.db.QueryContext(ctx,
		"SELECT id, total FROM orders WHERE customer_id = $1", customerID)
	if err != nil {
		return nil, fmt.Errorf("query orders of %s: %w", customerID, err)
	}
	defer rows.Close()
	rate, err := s.fx.Rate(ctx, "EUR")
	if err != nil {
		return nil, fmt.Errorf("fx rate: %w", err)
	}
	return scanOrders(rows, rate)
}
```

## Recommended refactorings

- **Add `ctx context.Context` as the first parameter** of every function that does I/O.
- Use the `…Context` variants of libraries and `http.NewRequestWithContext`.
- **`defer cancel()`** immediately after every `WithCancel/WithTimeout`.
- In loops and goroutines, `select` on `ctx.Done()`.
- Do not store contexts in structs: pass them as parameters.

## When it may be acceptable

- `main`, initialisation and top-level tests may create `context.Background()`.
- Work that must intentionally outlive the request (e.g. asynchronous auditing), using `context.WithoutCancel`
  (Go 1.21+) to keep values without inheriting cancellation.

## Related smells

- [Goroutine Leak](./goroutine-leak.md)
- [time.After in Loops](./time-after-in-loop.md)
- [Fetch in Effect without Abort (React)](../16-react-ts/fetch-race-condition.md)
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md)

## Automatic detection

- **go vet** `lostcancel`: flags `cancel` functions not called on all paths.
- **golangci-lint**: `noctx` (HTTP requests without a context), `contextcheck` (non-inherited contexts).
- **staticcheck**: SA1012 (passing a `nil` context).
- **revive**: `context-as-argument` (context must be the first parameter) and `context-keys-type`.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/missing-context/`](../../../go/smells/go_specific/missing-context/)

## References

- Go Blog — *Go Concurrency Patterns: Context*: https://go.dev/blog/context
- Package `context`: https://pkg.go.dev/context
- Go Code Review Comments — *Contexts*: https://go.dev/wiki/CodeReviewComments
- Teiva Harsanyi — *100 Go Mistakes* (#60 "Misunderstanding Go contexts"): https://100go.co
