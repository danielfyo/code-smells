# Naked Returns in Long Functions

> **ID:** CS161 · **Category:** Go-specific · **Sources:** Go Code Review Comments

## Definition

Using a bare `return` in long functions with named results (`func f() (total int, err error)`). The reader has to trace
the whole body to know which values are returned at each exit point.

## Symptoms

- Functions dozens of lines long with named results and several bare `return` statements.
- Results assigned in different branches, with some path forgetting to assign them.
- Named result variables shadowed with `:=` inside blocks.

## Common causes

- Saving keystrokes instead of repeating `return total, err`.
- Functions that were short, grew, and kept the style.

## Why it is a problem

- **Readability**: you cannot see what is returned at each `return`.
- **Subtle bugs**: returning a partial value or a stale `err` by mistake.
- **Shadowing**: `x, err := ...` in an inner block creates new variables and the bare `return` returns the outer ones
  (the compiler rejects some of these cases with "result parameter not in scope", but not all).

## How it works under the hood

Named results are local variables declared at the start of the function and initialised to their zero values. A bare
`return` returns their **current** values. In addition, deferred functions can read and modify those results after the
`return` statement executes and before the function actually returns, which is useful for capturing a `Close` error.
That is the legitimate reason to name results; using bare returns in long functions is a separate matter and hurts
clarity.

## Example (smelly)

```go
func ParseOrderLine(line string) (sku string, qty int, price float64, err error) {
	fields := strings.Split(line, ";")
	if len(fields) != 3 {
		err = fmt.Errorf("expected 3 fields, got %d", len(fields))
		return // SMELL: what is returned here?
	}
	sku = strings.TrimSpace(fields[0])
	if qty, err = strconv.Atoi(fields[1]); err != nil {
		return // SMELL: sku already set, qty half-done
	}
	if price, err = strconv.ParseFloat(fields[2], 64); err != nil {
		return
	}
	// … 30 more lines of validation with more bare returns …
	return
}
```

## Solution (refactored)

```go
type OrderLine struct {
	SKU   string
	Qty   int
	Price float64
}

// REFACTOR: unnamed results and explicit returns
func ParseOrderLine(line string) (OrderLine, error) {
	fields := strings.Split(line, ";")
	if len(fields) != 3 {
		return OrderLine{}, fmt.Errorf("expected 3 fields, got %d", len(fields))
	}
	qty, err := strconv.Atoi(fields[1])
	if err != nil {
		return OrderLine{}, fmt.Errorf("parse qty: %w", err)
	}
	price, err := strconv.ParseFloat(fields[2], 64)
	if err != nil {
		return OrderLine{}, fmt.Errorf("parse price: %w", err)
	}
	return OrderLine{SKU: strings.TrimSpace(fields[0]), Qty: qty, Price: price}, nil
}
```

## Recommended refactorings

- **Explicit returns** in any function longer than a few lines.
- **Introduce Result Object**: return a struct when there are many results.
- **Extract Function** to shorten the function.
- Keep named results only when they document meaning (`(lat, long float64)`) or when a `defer` must modify them.

## When it may be acceptable

- Very short functions (a few lines) where a bare `return` is obvious; Go Code Review Comments allows it.
- Named results needed so that a `defer` can adjust the returned error.

## Related smells

- [Long Method](../01-bloaters/long-method.md)
- [Output Arguments](../07-functions/output-arguments.md)
- [Obscured Intent](../11-general/obscured-intent.md)
- [defer in Loop](./defer-in-loop.md)

## Automatic detection

- **golangci-lint**: `nakedret` (bare returns in functions longer than N lines, configurable).
- **revive**: `bare-return`.
- The optional **go vet** `shadow` analyser for shadowed variables.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/naked-returns/`](../../../go/smells/go_specific/naked-returns/)

## References

- Go Code Review Comments — *Named Result Parameters* and *Naked Returns*: https://go.dev/wiki/CodeReviewComments
- Effective Go — *Named result parameters*: https://go.dev/doc/effective_go
- Teiva Harsanyi — *100 Go Mistakes* (#43 "Never using named result parameters", #44 "Unintended side effects with named result parameters"): https://100go.co
