// Package refactored fixes Dead Code by deleting everything that is never
// executed or used: version control already keeps the history.
package refactored

import "time"

// Coupon is a discount coupon.
// REFACTOR: Remove Dead Code (LegacyID field removed).
type Coupon struct {
	Code    string
	Percent int
	Expires time.Time
}

// Discount returns the applicable discount.
// REFACTOR: Remove Dead Code + Change Function Declaration (without the
// channel parameter or the legacy branch).
func Discount(c Coupon, now time.Time, total float64) float64 {
	if now.After(c.Expires) {
		return 0
	}
	return total * float64(c.Percent) / 100
}
