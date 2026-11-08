# Error Strings Style

> **ID:** CS166 · **Category:** Go-specific · **Sources:** Go Code Review Comments

## Definition

Error messages that start with a capital letter, end with a period or exclamation mark, include prefixes such as
"Error:" or lack context ("failed", "invalid input"). In Go errors are composed by chaining them
(`"load config: open file: permission denied"`), so their style matters.

## Symptoms

- `errors.New("Invalid quantity.")`, `fmt.Errorf("Error: could not save order!")`.
- Unreadable composite messages: `save order: Could not connect.: Timeout!`.
- Errors without identifying data (`"not found"` without saying what was not found).
- Error variables without the conventional prefix (`var NotFound = errors.New(...)` instead of `ErrNotFound`).

## Common causes

- Treating the error as a final message for the user rather than a link in a chain.
- Habits from other languages.

## Why it is a problem

- **Inconsistent composite messages** when errors are wrapped.
- **Poor diagnosis**: without context, logs do not reveal which operation failed or with what data.
- Mixed responsibilities: end-user text belongs in the presentation layer.

## How it works under the hood

An `error` in Go is any value with an `Error() string` method. When wrapping with `fmt.Errorf("context: %w", err)`, the
resulting message concatenates the context and the inner error's message. Because an error message almost always ends
up in the middle of another one, the convention is: lowercase, no trailing punctuation, and a prefix describing the
operation. Sentinel errors are named `ErrX` and error types `XError`.

## Example (smelly)

```go
var NotFound = errors.New("Not Found.")                 // SMELL: name and message

func (r *Repo) Reserve(sku string, qty int) error {
	if qty <= 0 {
		return errors.New("Error: invalid quantity!")    // SMELL: capitalised, prefix, no data
	}
	item, ok := r.items[sku]
	if !ok {
		return NotFound                                 // SMELL: what was not found?
	}
	if item.Stock < qty {
		return fmt.Errorf("Failed.")                    // SMELL: no context
	}
	item.Stock -= qty
	return nil
}
```

## Solution (refactored)

```go
var ErrNotFound = errors.New("item not found")          // REFACTOR: ErrX, lowercase

type InsufficientStockError struct {                    // REFACTOR: XError type carrying data
	SKU                  string
	Requested, Available int
}

func (e *InsufficientStockError) Error() string {
	return fmt.Sprintf("insufficient stock for %s: requested %d, available %d", e.SKU, e.Requested, e.Available)
}

func (r *Repo) Reserve(sku string, qty int) error {
	if qty <= 0 {
		return fmt.Errorf("reserve %s: invalid quantity %d", sku, qty)
	}
	item, ok := r.items[sku]
	if !ok {
		return fmt.Errorf("reserve %s: %w", sku, ErrNotFound)
	}
	if item.Stock < qty {
		return &InsufficientStockError{SKU: sku, Requested: qty, Available: item.Stock}
	}
	item.Stock -= qty
	return nil
}
```

## Recommended refactorings

- **Lowercase, no trailing punctuation** in every message.
- **Add context** (operation and identifiers) when creating or wrapping an error.
- **Name** sentinel errors `ErrX` and error types `XError`.
- Translate into user-facing messages in the presentation layer, based on `errors.Is/As`.

## When it may be acceptable

- Messages starting with a proper noun, an acronym or an exported identifier (`"HTTP request failed"`).
- Messages printed directly by a CLI that will never be wrapped.

## Related smells

- [Lost Error Wrapping (%v vs %w)](./lost-error-wrapping.md)
- [Ignored Errors](./ignored-errors.md)
- [Non-standard Nomenclature](../10-names/non-standard-nomenclature.md)
- [Inappropriate Information](../09-comments/inappropriate-information.md)

## Automatic detection

- **staticcheck**: `ST1005` (incorrectly formatted error strings) and `ST1012` (error variable naming).
- **revive**: `error-strings` and `error-naming`.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/error-string-style/`](../../../go/smells/go_specific/error-string-style/)

## References

- Go Code Review Comments — *Error Strings*: https://go.dev/wiki/CodeReviewComments
- Go Blog — *Working with Errors in Go 1.13*: https://go.dev/blog/go1.13-errors
- staticcheck — list of checks: https://staticcheck.dev/docs/checks/
