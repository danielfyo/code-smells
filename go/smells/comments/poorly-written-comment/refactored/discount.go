// Package refactored rewrites the comment precisely and briefly, and moves
// the magic numbers into named constants.
package refactored

const (
	loyaltyDiscountPercent = 10
	loyalCustomerMinYears  = 3
)

// LoyaltyDiscount returns the loyalty discount in cents: 10 % of the total
// for VIP customers or customers with at least 3 years of seniority, 0
// otherwise.
//
// REFACTOR: a carefully written comment (what it returns, in which unit and
// under which condition), with no rambling or doubts from the author.
func LoyaltyDiscount(totalCents int64, years int, vip bool) int64 {
	if vip || years >= loyalCustomerMinYears {
		return totalCents * loyaltyDiscountPercent / 100
	}
	return 0
}
