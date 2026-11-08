# defer in Loop

> **ID:** CS168 · **Category:** Go-specific · **Sources:** 100 Go Mistakes #35

## Definition

Using `defer` inside a loop body to release a per-iteration resource (`defer f.Close()`, `defer mu.Unlock()`,
`defer rows.Close()`). Deferred calls do not run at the end of the iteration but when the **function returns**, so
resources pile up for the whole loop.

## Symptoms

- `for _, path := range paths { f, _ := os.Open(path); defer f.Close(); … }`.
- `too many open files` errors when processing many files.
- Deadlocks from `defer mu.Unlock()` inside a loop that acquires the same lock again.
- Exhausted database connections in batch jobs.

## Common causes

- Applying the correct "`defer` right after acquiring" pattern without remembering its function scope.
- Long functions that process a whole collection in a single loop.

## Why it is a problem

- **Resource exhaustion**: file descriptors, connections, memory.
- **Deadlocks** when the resource is a mutex.
- **Latency**: all releases happen at once at the end.

## How it works under the hood

`defer` pushes a call onto a stack associated with the current **function**. The arguments (including the receiver,
like `f` in `f.Close()`) are evaluated when the `defer` statement executes, but the call runs when the function
returns (or panics), in LIFO order. A `for` block is not a boundary for `defer`. With N iterations, N calls and N open
resources accumulate. Extracting the loop body into its own function creates that boundary: the `defer` runs at the
end of each call, i.e. once per iteration.

## Example (smelly)

```go
func CountInvoiceLines(paths []string) (int, error) {
	total := 0
	for _, p := range paths {
		f, err := os.Open(p)
		if err != nil {
			return 0, err
		}
		defer f.Close() // SMELL: closed when the function returns, not the iteration

		sc := bufio.NewScanner(f)
		for sc.Scan() {
			total++
		}
	}
	return total, nil // all N files are closed here at once
}
```

## Solution (refactored)

```go
func CountInvoiceLines(paths []string) (int, error) {
	total := 0
	for _, p := range paths {
		n, err := countLines(p) // REFACTOR: Extract Function per iteration
		if err != nil {
			return 0, fmt.Errorf("count lines in %s: %w", p, err)
		}
		total += n
	}
	return total, nil
}

func countLines(path string) (int, error) {
	f, err := os.Open(path)
	if err != nil {
		return 0, err
	}
	defer f.Close() // runs when countLines returns: once per file

	n := 0
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		n++
	}
	return n, sc.Err()
}
```

## Recommended refactorings

- **Extract Function** from the loop body so each `defer` gets its own scope.
- An **immediately invoked anonymous function** (`func() { …; defer f.Close(); … }()`) if extracting is impractical.
- **Release explicitly** at the end of the iteration when there are no early returns or panic risk.

## When it may be acceptable

- Loops with a small, bounded number of iterations where keeping the resources open until the end is intentional (e.g.
  opening three files that will be used together).

## Related smells

- [Long Method](../01-bloaters/long-method.md)
- [time.After in Loops](./time-after-in-loop.md)
- [Naked Returns in Long Functions](./naked-returns.md)
- [Ignored Errors](./ignored-errors.md)

## Automatic detection

- **revive**: the `defer` rule (with the `loop` option, warns about `defer` inside loops).
- **gocritic** (via golangci-lint): the `deferInLoop` check.
- **staticcheck**: SA9001 ("defers in range loops may not run when you expect them to").

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/defer-in-loop/`](../../../go/smells/go_specific/defer-in-loop/)

## References

- Effective Go — *Defer*: https://go.dev/doc/effective_go
- Go Blog — *Defer, Panic, and Recover*: https://go.dev/blog/defer-panic-and-recover
- The Go Programming Language Specification — *Defer statements*: https://go.dev/ref/spec
- Teiva Harsanyi — *100 Go Mistakes* (#35 "Using defer inside a loop"): https://100go.co
