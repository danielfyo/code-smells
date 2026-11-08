// Package smelly shows obsolete comments: the code changed, the comment did
// not, and now it lies.
package smelly

// ShippingCost computes the shipping cost in cents.
// SMELL: the comment says "free from 50 EUR" but the code uses 60 EUR;
// someone changed the rule and forgot the comment.
// Free shipping for orders of 50 EUR or more. Flat rate of 3 EUR otherwise.
func ShippingCost(orderCents int64, express bool) int64 {
	if orderCents >= 6000 {
		return 0
	}
	// SMELL: the comment only mentions the flat rate, but there is an express
	// surcharge now. Readers will not realize the express parameter matters.
	// Always 3 EUR.
	cost := int64(300)
	if express {
		cost += 500
	}
	return cost
}
