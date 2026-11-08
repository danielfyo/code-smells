// Package refactored fixes Complicated Boolean Expression by extracting
// each sub-condition into a named predicate. The final rule reads like the
// business sentence: "domestic and (premium, big order or coupon)".
package refactored

// Cart is a shopping cart.
type Cart struct {
	Total        float64
	Country      string
	Premium      bool
	HasOversize  bool
	CouponFreeSh bool
	Items        int
}

const freeShippingThreshold = 50

// REFACTOR: Decompose Conditional / Extract Function (named predicates).
func (c Cart) isDomestic() bool { return c.Country == "ES" || c.Country == "PT" }

func (c Cart) isEmpty() bool { return c.Items == 0 }

func (c Cart) premiumPerk() bool { return c.Premium && !c.HasOversize }

func (c Cart) bigOrder() bool {
	return !c.HasOversize && !c.isEmpty() && c.Total >= freeShippingThreshold
}

func (c Cart) couponApplies() bool { return c.CouponFreeSh && !c.isEmpty() }

// FreeShipping reports whether shipping is free.
// REFACTOR: Consolidate Conditional Expression (isDomestic is factored out).
func FreeShipping(c Cart) bool {
	return c.isDomestic() && (c.premiumPerk() || c.bigOrder() || c.couponApplies())
}
