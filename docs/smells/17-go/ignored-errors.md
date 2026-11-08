# Ignored Errors

> **ID:** CS155 · **Category:** Go-specific · **Sources:** Go Code Review Comments; errcheck

## Definition

In Go, errors are values that functions return explicitly. The smell is discarding them — with the blank identifier
`_` or simply by not capturing the result — so that an I/O, parsing or network failure goes unnoticed and the program
carries on with invalid data.

## Symptoms

- `v, _ := strconv.Atoi(s)`, `data, _ := json.Marshal(x)`.
- Calls such as `f.Close()`, `w.Write(b)` or `tx.Rollback()` whose error is never looked at.
- `defer f.Close()` on files opened for **writing** (the `Close` error may mean data was not persisted).
- Unexplained zero values (`0`, `""`, `nil`) showing up downstream.

## Common causes

- Seeing `if err != nil` as "noise".
- Prototypes that reach production.
- Believing an operation "cannot fail".

## Why it is a problem

- **Silent failures**: the program continues with the type's zero value and corrupts data.
- **Very hard diagnosis**: the symptom appears far from the cause, with no trace.
- **Data loss**: ignored write, `Close` or `Sync` errors.

## How it works under the hood

Go has no exceptions for expected errors: a function that can fail returns `(T, error)`, and `T` is normally the zero
value when `err != nil`. The compiler forces you to use declared variables, but it does **not** force you to use the
results of a call, nor does it stop you from assigning them to `_`. Ignoring an error is therefore syntactically
trivial, and only analysis tools (errcheck) or team discipline prevent it. Wrapping the error with context
(`fmt.Errorf("...: %w", err)`) and returning it preserves the cause for whoever can decide what to do.

## Example (smelly)

```go
func LoadInventory(path string) map[string]int {
	f, _ := os.Open(path) // SMELL: if it fails, f is nil
	defer f.Close()

	stock := map[string]int{}
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		parts := strings.Split(sc.Text(), ",")
		qty, _ := strconv.Atoi(parts[1]) // SMELL: "abc" becomes 0
		stock[parts[0]] = qty
	}
	return stock // SMELL: sc.Err() is never checked
}
```

## Solution (refactored)

```go
func LoadInventory(path string) (map[string]int, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("open inventory %q: %w", path, err) // REFACTOR: propagate with context
	}
	defer f.Close() // read-only: the Close error carries no useful information

	stock := map[string]int{}
	sc := bufio.NewScanner(f)
	for line := 1; sc.Scan(); line++ {
		sku, qtyText, ok := strings.Cut(sc.Text(), ",")
		if !ok {
			return nil, fmt.Errorf("line %d: missing comma", line)
		}
		qty, err := strconv.Atoi(qtyText)
		if err != nil {
			return nil, fmt.Errorf("line %d: parse quantity: %w", line, err)
		}
		stock[sku] = qty
	}
	return stock, sc.Err()
}
```

## Recommended refactorings

- **Check and propagate** every error, adding context with `%w`.
- **Return `error`** from functions that used to swallow it.
- For `Close` on writers: capture its error via a named result and `errors.Join`, or call `Close` explicitly at the
  end of the happy path.
- If an error is ignored on purpose, make it explicit (`_ = x.Close()`) with a comment explaining why.

## When it may be acceptable

- Operations documented never to fail (`bytes.Buffer.Write`, `strings.Builder.WriteString` always return `nil`).
- `fmt.Println` in command-line tools, where nothing sensible can be done if standard output fails.
- `Close` on read-only resources after everything was read successfully.

## Related smells

- [Swallowed Exceptions](../08-error-handling/swallowed-exceptions.md)
- [Lost Error Wrapping (%v vs %w)](./lost-error-wrapping.md)
- [panic for Control Flow](./panic-for-control-flow.md)
- [Error Codes](../08-error-handling/error-codes.md)

## Automatic detection

- **errcheck** (enabled by default in golangci-lint): reports unchecked errors; with `-blank` also those assigned to `_`.
- **revive**: `unhandled-error` rule.
- **gosec**: G104 (unhandled errors).
- **go vet** `unusedresult` for pure functions whose result is unused.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/ignored-errors/`](../../../go/smells/go_specific/ignored-errors/)

## References

- Go Code Review Comments — *Handle Errors*: https://go.dev/wiki/CodeReviewComments
- Effective Go — *Errors*: https://go.dev/doc/effective_go
- Go Blog — *Error handling and Go*: https://go.dev/blog/error-handling-and-go
- errcheck: https://github.com/kisielk/errcheck
- Teiva Harsanyi — *100 Go Mistakes and How to Avoid Them* (#53 "Not handling an error", #54 "Not handling defer errors"): https://100go.co
