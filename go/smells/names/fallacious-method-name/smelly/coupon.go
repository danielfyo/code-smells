// Package smelly shows fallacious names: IsValid mutates state and
// GetDiscount returns the final price instead of the discount.
package smelly

// Coupon is a single-use discount coupon.
type Coupon struct {
	Code    string
	Percent int64
	Used    bool
}

// IsValid SMELL: an "Is" predicate should be a side-effect-free question, but
// it also marks the coupon as used. Calling it twice gives different answers.
func (c *Coupon) IsValid() bool {
	if c.Used {
		return false
	}
	c.Used = true
	return true
}

// GetDiscount SMELL: promises the discount and returns the discounted price.
func (c *Coupon) GetDiscount(priceCents int64) int64 {
	return priceCents - priceCents*c.Percent/100
}
