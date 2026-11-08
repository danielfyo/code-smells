# panic for Control Flow

> **ID:** CS156 · **Category:** Go-specific · **Sources:** Effective Go

## Definition

Using `panic` to signal expected errors (invalid input, record not found, insufficient balance) and `recover` to catch
them further up, imitating exceptions. In Go, `panic` is reserved for programming errors or unrecoverable situations;
expected errors are returned as `error` values.

## Symptoms

- `panic("user not found")` or `panic(err)` in library or domain code.
- Functions with `defer func() { if r := recover(); r != nil { … } }()` to turn panics into errors.
- Signatures that do not return `error` even though the operation can fail for normal reasons.

## Common causes

- Habits from languages with exceptions (Java, C#, Python).
- Trying to avoid the verbosity of `if err != nil`.
- Overusing `Must…` functions outside initialisation.

## Why it is a problem

- **Hidden contract**: the signature does not warn that the function can fail.
- **Process crashes**: an unrecovered panic in any goroutine terminates the whole program.
- **`recover` only works in the same goroutine**: a panic in a spawned goroutine cannot be caught from outside.
- Inconsistent state if the panic interrupts an operation with side effects halfway through.

## How it works under the hood

`panic` stops the normal execution of the function, runs its deferred calls and unwinds the current goroutine's stack.
`recover` only returns a non-`nil` value when it is called **directly from a deferred function** during that
unwinding. If the panic reaches the top of the goroutine unrecovered, the runtime prints the stack trace and
terminates the entire process, not just that goroutine. Errors as values, on the other hand, are part of the
signature, compose with `%w` and force the caller to decide.

## Example (smelly)

```go
func (s *AccountService) Withdraw(id string, amount int) {
	acc, ok := s.accounts[id]
	if !ok {
		panic("account not found") // SMELL: expected error as a panic
	}
	if acc.Balance < amount {
		panic(fmt.Sprintf("insufficient funds: %d", acc.Balance)) // SMELL
	}
	acc.Balance -= amount
}

func (h *Handler) HandleWithdraw(id string, amount int) (err error) {
	defer func() { // SMELL: recover used as try/catch
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
	}()
	h.svc.Withdraw(id, amount)
	return nil
}
```

## Solution (refactored)

```go
var (
	ErrAccountNotFound   = errors.New("account not found")
	ErrInsufficientFunds = errors.New("insufficient funds")
)

// REFACTOR: Replace Panic with Error return
func (s *AccountService) Withdraw(id string, amount int) error {
	acc, ok := s.accounts[id]
	if !ok {
		return fmt.Errorf("withdraw from %s: %w", id, ErrAccountNotFound)
	}
	if acc.Balance < amount {
		return fmt.Errorf("withdraw %d from %s: %w", amount, id, ErrInsufficientFunds)
	}
	acc.Balance -= amount
	return nil
}
// The caller decides: errors.Is(err, ErrInsufficientFunds) → HTTP 422, etc.
```

## Recommended refactorings

- **Replace `panic` with `return error`** and propagate upwards.
- **Sentinel errors** (`var ErrX = errors.New(...)`) or **error types** so callers can tell cases apart with `errors.Is/As`.
- Restrict `recover` to **boundaries** (HTTP middleware, a queue worker) so that a bug does not bring the server down,
  logging the stack trace.

## When it may be acceptable

- Violated invariants that indicate a bug (impossible index, corrupted state).
- `Must…` functions (`regexp.MustCompile`, `template.Must`) used at initialisation with constant input.
- Using `panic`/`recover` internally within a package (as `encoding/json` does), provided the public API returns
  `error`, as described in Effective Go.

## Related smells

- [Exceptions for Control Flow](../08-error-handling/exceptions-for-control-flow.md)
- [Ignored Errors](./ignored-errors.md)
- [init() Abuse](./init-abuse.md)
- [Lost Error Wrapping (%v vs %w)](./lost-error-wrapping.md)

## Automatic detection

- No standard linter forbids `panic`; with golangci-lint you can use **forbidigo** to ban `panic(` outside specific packages.
- **revive**: `deep-exit` flags `os.Exit`/`log.Fatal` outside `main`/`init` (related).
- Code review: look for `recover()` outside middleware or boundaries.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/panic-for-control-flow/`](../../../go/smells/go_specific/panic-for-control-flow/)

## References

- Effective Go — *Panic* and *Recover*: https://go.dev/doc/effective_go
- Go Code Review Comments — *Don't Panic*: https://go.dev/wiki/CodeReviewComments
- Go Blog — *Defer, Panic, and Recover*: https://go.dev/blog/defer-panic-and-recover
- Go Proverbs ("Don't panic"): https://go-proverbs.github.io
