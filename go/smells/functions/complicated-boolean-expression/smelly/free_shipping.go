// Package smelly illustrates Complicated Boolean Expression: a single long
// condition mixes rules about membership, amount, destination and oversize
// products. Reading it requires decomposing it in your head.
package smelly

// Cart is a shopping cart.
type Cart struct {
	Total        float64
	Country      string
	Premium      bool
	HasOversize  bool
	CouponFreeSh bool
	Items        int
}

// FreeShipping reports whether shipping is free.
// SMELL: Complicated Boolean Expression.
func FreeShipping(c Cart) bool {
	return (c.Premium && !c.HasOversize && (c.Country == "ES" || c.Country == "PT")) ||
		(!c.HasOversize && c.Total >= 50 && c.Items > 0 && (c.Country == "ES" || c.Country == "PT")) ||
		(c.CouponFreeSh && c.Items > 0 && !(c.Country != "ES" && c.Country != "PT"))
}
