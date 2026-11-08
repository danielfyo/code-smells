// Package smelly holds the production code (discount by quantity tiers); the
// smell lives in the test file.
package smelly

// DiscountPercent returns the discount for the ordered quantity:
// 1-9 → 0 %, 10-49 → 5 %, 50 or more → 10 %. Non-positive quantities → 0 %.
func DiscountPercent(qty int) int {
	switch {
	case qty >= 50:
		return 10
	case qty >= 10:
		return 5
	default:
		return 0
	}
}
