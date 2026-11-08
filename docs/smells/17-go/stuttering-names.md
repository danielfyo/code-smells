# Stuttering Names

> **ID:** CS164 · **Category:** Go-specific · **Sources:** Effective Go

## Definition

Repeating the package name in exported identifiers: `user.UserService`, `http.HTTPServer`, `order.OrderStatus`,
`config.ParseConfig`. In Go, exported identifiers are always used qualified by the package name, so the repetition is
redundant and lengthens the caller's code.

## Symptoms

- Calls like `invoice.NewInvoiceService(invoice.InvoiceConfig{…})`.
- Types whose name starts or ends with the package name.
- Linter warnings like "type name will be used as user.UserService by other packages, and that stutters".

## Common causes

- Habits from languages where names are imported unqualified (Java, C#).
- Packages organised by layer (`models`, `services`) instead of by domain, forcing the domain into the type name.

## Why it is a problem

- **Noise** at every call site.
- Often a sign of **improvable package design**: the package name is not contributing context.
- Inconsistency with the standard library (`bytes.Buffer`, `http.Server`).

## How it works under the hood

In Go the package name is part of every exported identifier's effective name: outside the package, `Server` is always
written `http.Server`. Effective Go recommends taking advantage of this: the package name provides the context and the
identifier does not need to repeat it. Thus the constructor of a package's main type can simply be called `New`
(`ring.New`), and variants `NewWithTimeout` rather than `NewRingWithTimeout`.

## Example (smelly)

```go
package customer

type CustomerService struct{ repo CustomerRepository } // SMELL: customer.CustomerService
type CustomerRepository interface{ Find(id string) (Customer, error) }
type CustomerStatus string                              // SMELL: customer.CustomerStatus

func NewCustomerService(r CustomerRepository) *CustomerService { // SMELL
	return &CustomerService{repo: r}
}

// From another package:
// svc := customer.NewCustomerService(repo)
// var s customer.CustomerStatus
```

## Solution (refactored)

```go
package customer

type Customer struct {
	ID, Name string
	Status   Status
}

type Status string                                       // REFACTOR: customer.Status
type Repository interface{ Find(id string) (Customer, error) } // customer.Repository

type Service struct{ repo Repository }                   // customer.Service

func NewService(r Repository) *Service { return &Service{repo: r} } // customer.NewService

// From another package:
// svc := customer.NewService(repo)
// var s customer.Status
```

## Recommended refactorings

- **Rename**: drop the prefix or suffix that repeats the package name.
- **A `New` constructor** when the package exports a single main type.
- **Reorganise packages by domain** (`customer`, `invoice`) instead of by technical layer.

## When it may be acceptable

- When the short name would be ambiguous or misleading, or it coincides with the package's main concept and there is
  no better name (e.g. type `Customer` in package `customer` is acceptable and common).
- Stable public APIs, where renaming would break users.

## Related smells

- [Encodings in Names](../10-names/encodings-in-names.md)
- [Non-standard Nomenclature](../10-names/non-standard-nomenclature.md)
- [Getters with Get Prefix](./get-prefix-getters.md)
- [utils / common Packages](./utils-package.md)

## Automatic detection

- **revive**: the `exported` rule (golint's successor), which warns about names that stutter.
- **staticcheck**: `ST1003` (naming conventions; it does not cover all stuttering).

## Implementations

Go-specific smell:

- Go: [`go/smells/go_specific/stuttering-names/`](../../../go/smells/go_specific/stuttering-names/)

## References

- Effective Go — *Package names*: https://go.dev/doc/effective_go
- Go Blog — *Package names*: https://go.dev/blog/package-names
- Go Code Review Comments — *Package Names*: https://go.dev/wiki/CodeReviewComments
