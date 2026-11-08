// Package smelly shows names that repeat the package name (order.OrderService)
// from the point of view of the code that uses them.
package smelly

import "github.com/danielfyo/code-smells/go/smells/go_specific/stuttering-names/smelly/order"

// Checkout creates and pays an order.
// SMELL: the caller reads order.NewOrderService, order.OrderStatus...
func Checkout(id string) order.OrderStatus {
	svc := order.NewOrderService()
	svc.CreateOrder(id)
	svc.PayOrder(id)
	return svc.OrderStatusOf(id)
}
