// Package smelly shows "clever" code: compact and cryptic, it shows off skill
// but hides what it does.
package smelly

// Fee computes the fee of a payment.
//
// SMELL: bit arithmetic, booleans turned into integers and magic numbers in a
// single line. Who would guess it means "2 % with a 30-cent minimum, doubled
// for international payments"?
func Fee(c int64, intl bool) int64 {
	b := int64(0)
	if intl {
		b = 1
	}
	return max(c*2/100, 30) << b
}

// IsWeekend SMELL: a bit mask instead of a readable comparison.
func IsWeekend(weekday int) bool { return (1<<weekday)&0x41 != 0 }
