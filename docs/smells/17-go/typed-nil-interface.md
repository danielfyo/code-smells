# Typed nil in Interface

> **ID:** CS171 · **Category:** Go-specific · **Sources:** Go FAQ

## Definition

Returning a concrete pointer that is `nil` through an interface type (usually `error`). The resulting interface value
is **not `nil`**, because it carries type information, so the caller's `if err != nil` check succeeds even though
"there is no error".

## Symptoms

- Functions with `var err *ValidationError` (or `*MyError`) ending in `return err`.
- `if err != nil` takes the error branch and then `err.Error()` panics on a nil pointer, or prints `<nil>`.
- Behaviour that changes when a variable's declared type changes from `*MyError` to `error`.

## Common causes

- Declaring error variables with the concrete type instead of `error`.
- Functions returning the concrete type (`func validate() *ValidationError`) whose result is assigned to an `error`.
- Not knowing how interfaces are represented internally.

## Why it is a problem

- **Phantom errors**: the error path triggers with no real error.
- **Panics** when calling methods on the nil pointer.
- Very confusing bugs: in the debugger the value "looks" `nil`.

## How it works under the hood

A Go interface value is a **(dynamic type, dynamic value)** pair. An interface is `nil` only if **both** components are
empty. When a nil `*ValidationError` is assigned to an `error`, the interface becomes `(*ValidationError, nil)`: the
type is present, so `err != nil` is true. Comparing with `nil` does not look "inside" the pointer. The fix is to return
the literal `nil` explicitly on the success path, and to declare variables and results with the interface type
`error`.

## Example (smelly)

```go
type ValidationError struct{ Field string }

func (e *ValidationError) Error() string { return "invalid field " + e.Field }

func ValidateOrder(o Order) error {
	var verr *ValidationError // SMELL: variable with the concrete type
	if o.Quantity <= 0 {
		verr = &ValidationError{Field: "quantity"}
	}
	return verr // SMELL: (*ValidationError)(nil) becomes a non-nil error
}

// if err := ValidateOrder(validOrder); err != nil { … }  // always taken!
```

## Solution (refactored)

```go
func ValidateOrder(o Order) error {
	if o.Quantity <= 0 {
		return &ValidationError{Field: "quantity"}
	}
	return nil // REFACTOR: literal nil of interface type
}

// And when accumulating in a variable, make it of type error:
func ValidateAll(orders []Order) error {
	var err error // REFACTOR: interface type
	for _, o := range orders {
		if e := ValidateOrder(o); e != nil {
			err = errors.Join(err, e)
		}
	}
	return err
}
```

## Recommended refactorings

- **Return a literal `nil`** on the success path.
- **Declare results and variables as `error`**, not as the concrete type.
- Avoid functions returning `*MyError` if their result will end up in an `error`.
- Use `errors.As` to recover the concrete type when needed.

## When it may be acceptable

- Pointer-receiver methods that deliberately handle `nil` (some types do so on purpose), as long as nobody compares the
  interface with `nil` expecting a different meaning. In practice, for `error` there is no reasonable exception.

## Related smells

- [Lost Error Wrapping (%v vs %w)](./lost-error-wrapping.md)
- [Null Abuse](../06-data/null-abuse.md)
- [Pointer to Interface](./pointer-to-interface.md)
- [Empty Interface Abuse](./empty-interface-abuse.md)

## Automatic detection

- **staticcheck**: `SA4023` (impossible comparison of an interface value with untyped `nil`).
- **nilness** (an analyser from `golang.org/x/tools`, built into gopls) for redundant or impossible `nil` checks.
- **golangci-lint**: `nilnil` and `nilerr` help with related error-return patterns.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/typed-nil-interface/`](../../../go/smells/go_specific/typed-nil-interface/)

## References

- Go FAQ — *Why is my nil error value not equal to nil?*: https://go.dev/doc/faq#nil_error
- Effective Go — *Interfaces*: https://go.dev/doc/effective_go
- Teiva Harsanyi — *100 Go Mistakes* (#45 "Returning a nil receiver"): https://100go.co
