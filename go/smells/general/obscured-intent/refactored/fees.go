// Package refactored expresses the same logic explicitly, with names and
// steps that tell the business rule.
package refactored

import "time"

const (
	feePercent              = 2
	minimumFeeCents         = 30
	internationalMultiplier = 2
)

// Fee computes the fee: 2 % of the amount with a 30-cent minimum, doubled for
// international payments.
//
// REFACTOR: Replace Magic Number with Symbolic Constant and named steps
// instead of bit shifts.
func Fee(amountCents int64, international bool) int64 {
	fee := max(amountCents*feePercent/100, minimumFeeCents)
	if international {
		fee *= internationalMultiplier
	}
	return fee
}

// IsWeekend reports whether the day (0 = Sunday) falls on a weekend.
func IsWeekend(weekday int) bool {
	day := time.Weekday(weekday)
	return day == time.Saturday || day == time.Sunday
}
