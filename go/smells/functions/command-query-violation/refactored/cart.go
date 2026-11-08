// Package refactored fixes the Command-Query Separation violation:
// ApplyCoupon is a command (changes state, returns only an error) and Total
// is a pure query that can be called as many times as you like.
package refactored

import "errors"

// Coupon errors.
var (
	ErrUnknownCoupon  = errors.New("unknown coupon")
	ErrAlreadyApplied = errors.New("coupon already applied")
)

// Cart is a shopping cart.
type Cart struct {
	subtotal float64
	coupon   string
}

// NewCart creates a cart with a subtotal.
func NewCart(subtotal float64) *Cart { return &Cart{subtotal: subtotal} }

// ApplyCoupon is a command: it modifies state and returns no data.
// REFACTOR: Separate Query from Modifier.
func (c *Cart) ApplyCoupon(code string) error {
	if code != "SAVE10" {
		return ErrUnknownCoupon
	}
	if c.coupon != "" {
		return ErrAlreadyApplied
	}
	c.coupon = code
	return nil
}

// Total is a query without side effects.
func (c *Cart) Total() float64 {
	if c.coupon == "SAVE10" {
		return c.subtotal * 0.90
	}
	return c.subtotal
}
