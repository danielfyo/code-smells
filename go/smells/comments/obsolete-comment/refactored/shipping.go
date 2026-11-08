// Package refactored replaces stale comments with named constants that
// cannot drift away from the code.
package refactored

// REFACTOR: the rules live in named constants; the code explains itself and
// there is no comment left that can lie about the figures.
const (
	freeShippingThresholdCents = 6000
	flatRateCents              = 300
	expressSurchargeCents      = 500
)

// ShippingCost returns the shipping cost in cents: free from the threshold
// upwards, flat rate otherwise, plus a surcharge for express delivery.
func ShippingCost(orderCents int64, express bool) int64 {
	if orderCents >= freeShippingThresholdCents {
		return 0
	}
	cost := int64(flatRateCents)
	if express {
		cost += expressSurchargeCents
	}
	return cost
}
