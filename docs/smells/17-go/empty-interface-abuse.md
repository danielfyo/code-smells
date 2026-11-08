# Empty Interface Abuse

> **ID:** CS158 · **Category:** Go-specific · **Sources:** 100 Go Mistakes #8

## Definition

Using `interface{}` (or its alias `any`, since Go 1.18) as the type of parameters, fields or results when a concrete
type, an interface with methods or a generic would express the intent better. Every value fits in `any`, so the
compiler stops checking anything and the work moves to runtime type assertions.

## Symptoms

- `func Process(data any) any`, `map[string]interface{}` for data with a known structure.
- Cascades of `switch v := x.(type)` or assertions `x.(Order)` scattered through the code.
- Panics like `interface conversion: interface {} is string, not int`.
- "Generic" helpers written with `any` instead of type parameters.

## Common causes

- Code written before Go 1.18 generics.
- Decoding JSON into `map[string]any` for convenience.
- Wanting a "universal" function instead of modelling types.

## Why it is a problem

- **Runtime errors** instead of compile-time errors.
- **Opaque API**: the signature says nothing about what it accepts or returns.
- **Cost**: storing values in interfaces often implies heap allocations and assertions.
- Unsafe refactorings: changing a type does not break compilation where it is used via `any`.

## How it works under the hood

A Go interface value is a **(dynamic type, value)** pair. `any` requires no methods, so every value satisfies it and the
static type carries no information. Getting the concrete value back requires a type assertion `x.(T)` (which panics
on failure unless you use the `v, ok := x.(T)` form) or a type switch. **Generics** allow reusable code while keeping
types: `func Sum[T int | float64](xs []T) T` is checked at compile time for each instantiation. An **interface with
methods** expresses behaviour rather than "anything".

## Example (smelly)

```go
// SMELL: anything goes in, anything comes out
func TotalAmount(items []any) float64 {
	var total float64
	for _, it := range items {
		switch v := it.(type) {
		case map[string]any:
			total += v["price"].(float64) * float64(v["qty"].(int)) // panics if the shape differs
		case Product:
			total += v.Price
		}
	}
	return total
}
```

## Solution (refactored)

```go
// REFACTOR: concrete type or behavioural interface
type LineItem struct {
	Price float64
	Qty   int
}

type Priced interface{ Subtotal() float64 }

func (l LineItem) Subtotal() float64 { return l.Price * float64(l.Qty) }

func TotalAmount[T Priced](items []T) float64 { // REFACTOR: generic with a constraint
	var total float64
	for _, it := range items {
		total += it.Subtotal()
	}
	return total
}
```

## Recommended refactorings

- **Replace `any` with the concrete type** when there is only one.
- **Interfaces with methods** describing the required behaviour.
- **Generics with constraints** for reusable containers and algorithms.
- **Decode JSON into tagged structs** instead of `map[string]any`.
- Use the `v, ok := x.(T)` form when an assertion is unavoidable.

## When it may be acceptable

- Inherently dynamic APIs: `fmt.Println(a ...any)`, `encoding/json`, `context.WithValue`.
- JSON whose structure is genuinely unknown or arbitrary.
- Reflection-based boundaries (ORMs, serializers).

## Related smells

- [any Abuse (TypeScript)](../16-react-ts/any-type.md)
- [Primitive Obsession](../01-bloaters/primitive-obsession.md)
- [Interface Pollution](./interface-pollution.md)
- [Type Assertion (as) Abuse (TypeScript)](../16-react-ts/type-assertion-abuse.md)

## Automatic detection

- **golangci-lint**: `forcetypeassert` (assertions without `ok`).
- **revive**: `use-any` (suggests `any` over `interface{}`; style only, not abuse).
- `go vet` does not detect the abuse itself; it needs design review.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/empty-interface-abuse/`](../../../go/smells/go_specific/empty-interface-abuse/)

## References

- Effective Go — *Interfaces* and *Type switch*: https://go.dev/doc/effective_go
- Go Blog — *An Introduction To Generics*: https://go.dev/blog/intro-generics
- Go Proverbs ("interface{} says nothing"): https://go-proverbs.github.io
- Teiva Harsanyi — *100 Go Mistakes* (#8 "any says nothing", #9 "Being confused about when to use generics"): https://100go.co
