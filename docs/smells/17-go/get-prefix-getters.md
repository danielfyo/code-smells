# Getters with Get Prefix

> **ID:** CS165 · **Category:** Go-specific · **Sources:** Effective Go

## Definition

Naming accessor methods with a `Get` prefix (`GetOwner()`, `GetTotal()`), Java style. Go's convention is that the
getter for an `owner` field is called `Owner()` and the setter, if any, `SetOwner()`. By extension, the smell includes
adding trivial getters and setters to every field for no reason.

## Symptoms

- `GetX()` methods that simply return a field.
- `GetX`/`SetX` pairs for every field of a struct, even in internal types.
- Caller code such as `order.GetCustomer().GetAddress().GetCity()`.

## Common causes

- Java/C# habits or code generators.
- Believing encapsulation always requires getters and setters.

## Why it is a problem

- **Unidiomatic**: clashes with the standard library and the rest of the ecosystem.
- **Noise**: the prefix adds no information.
- **Apparent encapsulation**: trivial getters and setters expose internal state just the same.
- It can hide that `Get…` does expensive work (queries, I/O) deserving another name (`Fetch`, `Load`).

## How it works under the hood

In Go, visibility is decided by the initial letter's case: `owner` is package-private and `Owner` is exported. A
private field `owner` and an exported method `Owner()` therefore coexist without conflict, and a `Get` prefix is not
needed to distinguish them. Effective Go says so explicitly: it is neither idiomatic nor necessary to put `Get` in a
getter's name. If a field has no invariants to protect, exporting it directly is the usual choice.

## Example (smelly)

```go
type Booking struct {
	id     string
	guest  string
	nights int
}

func (b *Booking) GetID() string     { return b.id }     // SMELL
func (b *Booking) GetGuest() string  { return b.guest }  // SMELL
func (b *Booking) SetGuest(g string) { b.guest = g }     // setter with no invariants
func (b *Booking) GetNights() int    { return b.nights } // SMELL

// fmt.Println(booking.GetGuest(), booking.GetNights())
```

## Solution (refactored)

```go
type Booking struct {
	id     string
	Guest  string // REFACTOR: no invariants → exported field
	nights int
}

func (b *Booking) ID() string  { return b.id }     // REFACTOR: getter without prefix
func (b *Booking) Nights() int { return b.nights }

// SetNights enforces an invariant, so the setter adds value.
func (b *Booking) SetNights(n int) error {
	if n <= 0 {
		return fmt.Errorf("nights must be positive, got %d", n)
	}
	b.nights = n
	return nil
}
```

## Recommended refactorings

- **Rename Method**: `GetX()` → `X()`.
- **Export the field** when there are no invariants to protect.
- Keep setters only when they validate or have effects; if they do expensive work, give them a name that says so.

## When it may be acceptable

- Generated code (protobuf generates `GetX()` on purpose, because those getters tolerate `nil` receivers).
- Implementing external interfaces that require those names.
- When "get" is part of the domain concept (e.g. an HTTP client with a `Get` method for the GET request).

## Related smells

- [Stuttering Names](./stuttering-names.md)
- [Non-standard Nomenclature](../10-names/non-standard-nomenclature.md)
- [Data Class](../04-dispensables/data-class.md)
- [Message Chains](../05-couplers/message-chains.md)

## Automatic detection

- There is no widely used standard analyser that forbids the `Get` prefix; detect it in review or with custom rules
  (e.g. a `forbidigo` pattern or a custom `go/analysis` pass).

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/get-prefix-getters/`](../../../go/smells/go_specific/get-prefix-getters/)

## References

- Effective Go — *Getters*: https://go.dev/doc/effective_go
- Go Code Review Comments: https://go.dev/wiki/CodeReviewComments
- Teiva Harsanyi — *100 Go Mistakes* (#4 "Overusing getters and setters"): https://100go.co
