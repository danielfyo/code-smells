# Pointer to Interface

> **ID:** CS176 · **Category:** Go-specific · **Sources:** Go Code Review Comments

## Definition

Using pointers to interface types (`*io.Reader`, `*PaymentGateway`) in parameters, fields or results. An interface
value can already hold a pointer to the concrete data, so the extra pointer is almost never needed and usually
reveals confusion about how Go interfaces work.

## Symptoms

- Signatures like `func NewService(repo *Repository)` where `Repository` is an interface.
- Dereferences to call methods: `(*repo).Find(id)`.
- Compile errors like "`repo.Find undefined (type *Repository is pointer to interface, not interface)`".
- `*Logger` fields where `Logger` is an interface.

## Common causes

- Believing that passing an interface by value copies the underlying object.
- A habit of passing "everything by pointer" to avoid copies.
- Confusing interfaces with structs.

## Why it is a problem

- **Clumsier code**: explicit dereferences and `nil` checks at two levels.
- **No methods**: the method set of `*I` is empty; methods cannot be called without dereferencing.
- **Confusing semantics**: the caller can replace the whole implementation through the pointer.

## How it works under the hood

An interface value is a small pair (dynamic type, data pointer/value). Passing it by value copies only that pair, not
the concrete object; if the implementation is a `*Struct`, both sides still share the same struct. A pointer to an
interface (`*I`) is a pointer to that pair: its method set is empty, so it does not satisfy `I` and its methods cannot
be called without `(*p).M()`. The rule of thumb: accept the interface by value and let the implementation decide
whether its methods have pointer receivers.

## Example (smelly)

```go
type PaymentGateway interface {
	Charge(customerID string, cents int64) error
}

type CheckoutService struct {
	gateway *PaymentGateway // SMELL: pointer to interface
}

func NewCheckoutService(g *PaymentGateway) *CheckoutService { // SMELL
	return &CheckoutService{gateway: g}
}

func (s *CheckoutService) Pay(customerID string, cents int64) error {
	return (*s.gateway).Charge(customerID, cents) // SMELL: forced dereference
}

// var g PaymentGateway = &StripeGateway{}; svc := NewCheckoutService(&g)
```

## Solution (refactored)

```go
type CheckoutService struct {
	gateway PaymentGateway // REFACTOR: the interface by value
}

func NewCheckoutService(g PaymentGateway) *CheckoutService {
	return &CheckoutService{gateway: g}
}

func (s *CheckoutService) Pay(customerID string, cents int64) error {
	return s.gateway.Charge(customerID, cents)
}

// svc := NewCheckoutService(&StripeGateway{}) // *StripeGateway implements the interface
```

## Recommended refactorings

- **Change `*I` to `I`** in parameters, fields and results.
- If the goal was "sharing state", make the **implementation use pointer receivers** and pass `&Concrete{}`.
- If the caller needed to replace the dependency, return it or use an explicit setter.

## When it may be acceptable

- Very rare cases where a function must **write** an interface value into a caller's variable, as
  `errors.As(err, &target)` does when `target` has an interface type, or `json.Unmarshal` with `*any`.

## Related smells

- [Interface Pollution](./interface-pollution.md)
- [Typed nil in Interface](./typed-nil-interface.md)
- [Copying sync.Mutex](./copying-mutex.md)
- [Obscured Intent](../11-general/obscured-intent.md)

## Automatic detection

- **gocritic** (via golangci-lint): `ptrToRefParam` warns about pointers to reference types (maps, channels, interfaces) as parameters.
- The compiler rejects method calls on `*I` without dereferencing, which usually makes the problem obvious.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/pointer-to-interface/`](../../../go/smells/go_specific/pointer-to-interface/)

## References

- Go Code Review Comments — *Interfaces* and *Pass Values*: https://go.dev/wiki/CodeReviewComments
- Go FAQ — *When should I use a pointer to an interface?*: https://go.dev/doc/faq
- Uber Go Style Guide — *Pointers to Interfaces*: https://github.com/uber-go/guide/blob/master/style.md
- Effective Go — *Interfaces*: https://go.dev/doc/effective_go
