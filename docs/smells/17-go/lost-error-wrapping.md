# Lost Error Wrapping (%v vs %w)

> **ID:** CS167 · **Category:** Go-specific · **Sources:** Go 1.13 errors

## Definition

Adding context to an error with `fmt.Errorf("...: %v", err)` (or `%s`) instead of `%w`, or comparing errors with `==`
or direct type assertions. The text survives, but the **error chain** is broken: callers can no longer use
`errors.Is` or `errors.As` to recognise the cause.

## Symptoms

- `fmt.Errorf("load order: %v", err)` followed, in another layer, by `if err == sql.ErrNoRows`.
- `if e, ok := err.(*NotFoundError); ok` that stops working once context is added.
- Text comparisons: `strings.Contains(err.Error(), "not found")`.
- HTTP 500 responses where a 404 was expected because the cause was lost along the way.

## Common causes

- Code from before Go 1.13.
- Not knowing the difference between `%v` and `%w`.
- Comparing errors as simple values out of habit.

## Why it is a problem

- **Impossible decisions**: upper layers cannot distinguish "not found" from "network failure".
- **Brittle text comparisons** that break when a message changes.
- Incorrect retry logic or HTTP status codes.

## How it works under the hood

Since Go 1.13, `fmt.Errorf` with the `%w` verb returns an error that implements `Unwrap() error` (or `Unwrap() []error`
when there are several `%w`, since Go 1.20). `errors.Is(err, target)` walks that chain comparing each link with
`target` (and calling an `Is` method if present); `errors.As(err, &target)` finds the first link assignable to
`target`'s type. With `%v` the inner error is turned into text and disappears from the tree: there is no `Unwrap`, so
the search stops. `==` only compares the outermost link, which is why it fails as soon as someone adds context.

## Example (smelly)

```go
var ErrOrderNotFound = errors.New("order not found")

func (r *Repo) Find(id string) (Order, error) {
	o, ok := r.orders[id]
	if !ok {
		return Order{}, ErrOrderNotFound
	}
	return o, nil
}

func (s *Service) Ship(id string) error {
	if _, err := s.repo.Find(id); err != nil {
		return fmt.Errorf("ship order %s: %v", id, err) // SMELL: %v breaks the chain
	}
	return nil
}

func statusFor(err error) int {
	if err == ErrOrderNotFound { // SMELL: == cannot see through the wrapper
		return 404
	}
	return 500 // always ends up here
}
```

## Solution (refactored)

```go
func (s *Service) Ship(id string) error {
	if _, err := s.repo.Find(id); err != nil {
		return fmt.Errorf("ship order %s: %w", id, err) // REFACTOR: %w keeps the cause
	}
	return nil
}

func statusFor(err error) int {
	var valErr *ValidationError
	switch {
	case errors.Is(err, ErrOrderNotFound): // REFACTOR: walks the chain
		return 404
	case errors.As(err, &valErr):           // REFACTOR: matches by type
		return 422
	default:
		return 500
	}
}
```

## Recommended refactorings

- **Use `%w`** when wrapping errors the caller may need to inspect.
- **Replace `==` with `errors.Is`** and type assertions with **`errors.As`**.
- **`errors.Join`** (Go 1.20+) to combine several errors while keeping them all.
- Never compare on `err.Error()`.

## When it may be acceptable

- Using `%v` **deliberately** to avoid exposing an implementation detail as part of the API (e.g. not leaking the
  underlying database's errors to a package's clients). The Go 1.13 errors post describes this as a legitimate design
  decision.
- Comparing with `==` the direct result of a function documented to return the sentinel unwrapped (`io.EOF` from
  `Read`), although `errors.Is` is still more robust.

## Related smells

- [Error Strings Style](./error-string-style.md)
- [Ignored Errors](./ignored-errors.md)
- [Typed nil in Interface](./typed-nil-interface.md)
- [Swallowed Exceptions](../08-error-handling/swallowed-exceptions.md)

## Automatic detection

- **golangci-lint**: `errorlint` (flags `%v` with errors in `fmt.Errorf`, `==` comparisons and type assertions on errors).
- **go vet** `printf`: flags incorrect uses of `%w` (e.g. outside `fmt.Errorf`).
- `wrapcheck`: requires wrapping errors that come from external packages.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/lost-error-wrapping/`](../../../go/smells/go_specific/lost-error-wrapping/)

## References

- Go Blog — *Working with Errors in Go 1.13*: https://go.dev/blog/go1.13-errors
- Package `errors`: https://pkg.go.dev/errors
- Teiva Harsanyi — *100 Go Mistakes* (#49 "Ignoring when to wrap an error", #50 and #51 on checking error types and values): https://100go.co
