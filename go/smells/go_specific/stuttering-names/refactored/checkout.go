// Package refactored uses names that do not stutter: they read naturally with
// the package prefix (order.Service, order.Paid).
package refactored

import "github.com/danielfyo/code-smells/go/smells/go_specific/stuttering-names/refactored/order"

// Checkout creates and pays an order.
//
// REFACTOR: the caller reads order.NewService, svc.Create, order.Status.
func Checkout(id string) order.Status {
	svc := order.NewService()
	svc.Create(id)
	svc.Pay(id)
	return svc.Status(id)
}
