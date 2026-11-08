// Package smelly illustrates Dead Code: unused parameters, a branch guarded
// by a constant that is always false, a function nobody calls and a field
// nobody reads. All of it still has to be read and maintained.
package smelly

import (
	"strings"
	"time"
)

// SMELL: Dead Code. Switch for a migration finished years ago.
const legacyCoupons = false

// Coupon is a discount coupon.
type Coupon struct {
	Code    string
	Percent int
	Expires time.Time
	// SMELL: field nobody reads or writes.
	LegacyID int
}

// Discount returns the applicable discount.
// SMELL: the channel parameter is not used anywhere.
func Discount(c Coupon, now time.Time, total float64, channel string) float64 {
	if legacyCoupons {
		// SMELL: branch that never runs.
		if strings.HasPrefix(c.Code, "OLD") {
			return total * 0.5
		}
	}
	if now.After(c.Expires) {
		return 0
	}
	return total * float64(c.Percent) / 100
}

// formatLegacyCode is no longer called by anyone.
// SMELL: dead function.
func formatLegacyCode(id int) string {
	return "OLD-" + strings.Repeat("0", 6-len(string(rune(id))))
}
