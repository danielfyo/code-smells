// Package smelly illustrates Command-Query Separation Violation: ApplyCoupon
// changes the cart state and also returns the total. Whoever calls it "to
// check" the total applies the discount again.
package smelly

// Cart is a shopping cart.
type Cart struct {
	subtotal float64
	discount float64
}

// NewCart creates a cart with a subtotal.
func NewCart(subtotal float64) *Cart { return &Cart{subtotal: subtotal} }

// ApplyCoupon applies a coupon and returns the total.
// SMELL: Command-Query Violation. It is a command and a query at once, and
// every call accumulates another 10%.
func (c *Cart) ApplyCoupon(code string) float64 {
	if code == "SAVE10" {
		c.discount += c.subtotal * 0.10
	}
	return c.subtotal - c.discount
}
