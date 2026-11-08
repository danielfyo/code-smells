# Interface Pollution

> **ID:** CS157 · **Category:** Go-specific · **Sources:** 100 Go Mistakes #5

## Definition

Creating interfaces "just in case" in the package that **produces** the implementation, usually one per struct and
mirroring all its methods, when there is only one implementation and no consumer needs the abstraction. It is Go's
idiomatic flavour of [Speculative Generality](../04-dispensables/speculative-generality.md).

## Symptoms

- Pairs of `type UserService interface { … }` + `type userService struct { … }` with the same methods.
- Constructors that return the interface (`func NewUserService() UserService`).
- Interfaces with ten or more methods that nobody uses in full.
- Generated mocks for interfaces that exist only for tests.

## Common causes

- Porting Java/C# patterns, where interfaces must be declared explicitly and up front.
- "So we can mock it", without thinking about what the consumer actually needs.

## Why it is a problem

- **Pointless indirection**: jumping from the interface to its single implementation when reading code.
- **Weak abstractions**: large interfaces are hard to implement and to substitute.
- **Coupling to the producer**: every consumer depends on a huge interface even if it uses one method.
- Returning interfaces hides useful concrete methods and fields.

## How it works under the hood

Go interfaces are satisfied **implicitly**: any type with the right methods implements the interface without
declaring it. That lets the **consumer** define the minimal interface it needs, in its own package, when it needs it
(for example, for a test). Hence the idiomatic advice "accept interfaces, return structs" and "the bigger the
interface, the weaker the abstraction". A one- or two-method interface (`io.Reader`, `io.Writer`) is easy to implement
and compose.

## Example (smelly)

```go
// package billing (producer)
type InvoiceRepository interface { // SMELL: producer-side interface with a single implementation
	Save(inv Invoice) error
	FindByID(id string) (Invoice, error)
	FindByCustomer(customerID string) ([]Invoice, error)
	Delete(id string) error
	Count() (int, error)
}

type postgresInvoiceRepository struct{ db *sql.DB }

func NewInvoiceRepository(db *sql.DB) InvoiceRepository { // SMELL: returns the interface
	return &postgresInvoiceRepository{db: db}
}
```

## Solution (refactored)

```go
// package billing — REFACTOR: return the concrete type
type PostgresInvoiceRepository struct{ db *sql.DB }

func NewPostgresInvoiceRepository(db *sql.DB) *PostgresInvoiceRepository {
	return &PostgresInvoiceRepository{db: db}
}

// package reminders (consumer) — REFACTOR: minimal interface defined where it is used
type invoiceFinder interface {
	FindByCustomer(customerID string) ([]billing.Invoice, error)
}

type Sender struct{ invoices invoiceFinder }
// In tests a single-method fake is enough.
```

## Recommended refactorings

- **Remove the interface** and use the concrete type while there is a single implementation (*Collapse Hierarchy*).
- **Move the interface to the consumer** and shrink it to the methods it uses (minimal *Extract Interface*).
- **Return structs** from constructors.
- Compose small interfaces (`io.ReadWriter`) instead of defining a big one.

## When it may be acceptable

- Several real implementations (in-memory and database storage, different payment providers).
- Libraries publishing a stable contract for third parties to implement (`http.Handler`, `sort.Interface`).
- Boundaries with external systems where explicit decoupling is desired.

## Related smells

- [Speculative Generality](../04-dispensables/speculative-generality.md)
- [Lazy Class](../04-dispensables/lazy-class.md)
- [Pointer to Interface](./pointer-to-interface.md)
- [Empty Interface Abuse](./empty-interface-abuse.md)
- [Middle Man](../05-couplers/middle-man.md)

## Automatic detection

- **golangci-lint**: `interfacebloat` (interfaces with too many methods) and `ireturn` ("accept interfaces, return concrete types").
- Code review: interfaces with a single implementation in the same package.

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/interface-pollution/`](../../../go/smells/go_specific/interface-pollution/)

## References

- Go Code Review Comments — *Interfaces*: https://go.dev/wiki/CodeReviewComments
- Effective Go — *Interfaces and other types*: https://go.dev/doc/effective_go
- Go Proverbs ("The bigger the interface, the weaker the abstraction"): https://go-proverbs.github.io
- Teiva Harsanyi — *100 Go Mistakes* (#5 "Interface pollution", #6 "Interface on the producer side", #7 "Returning interfaces"): https://100go.co
