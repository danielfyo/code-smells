// Package refactored aligns names with behavior: a pure query, an explicit
// command to redeem, and two well-named calculations.
package refactored

// Coupon is a single-use discount coupon.
type Coupon struct {
	Code    string
	Percent int64
	Used    bool
}

// IsValid reports whether the coupon can be used. It has no side effects.
//
// REFACTOR: Separate Query from Modifier.
func (c *Coupon) IsValid() bool { return !c.Used }

// Redeem redeems the coupon; it returns false if it was already used.
func (c *Coupon) Redeem() bool {
	if c.Used {
		return false
	}
	c.Used = true
	return true
}

// Discount returns the discounted amount.
func (c *Coupon) Discount(priceCents int64) int64 { return priceCents * c.Percent / 100 }

// FinalPrice returns the price after applying the coupon.
//
// REFACTOR: Rename Method; what used to be called GetDiscount is FinalPrice.
func (c *Coupon) FinalPrice(priceCents int64) int64 { return priceCents - c.Discount(priceCents) }
