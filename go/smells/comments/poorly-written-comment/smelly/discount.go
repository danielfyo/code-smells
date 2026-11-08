// Package smelly shows poorly written comments: ambiguous, rambling and full
// of typos, they confuse more than they help.
package smelly

// SMELL: ambiguous, rambling comment; it does not say what "the customer
// thing" is, whether 10 is a percentage or cents, or when it applies.
// heres the discount thing they said, careful sometimes it doesnt work (i
// think bc of the customer thing??) 10 is the usual but now vips too, or not, check
//
// LoyaltyDiscount ...
func LoyaltyDiscount(totalCents int64, years int, vip bool) int64 {
	// SMELL: "weird stuff" explains nothing; the reader still ignores the rule.
	// weird stuff but it works dont touch!!!
	if vip || years >= 3 {
		return totalCents * 10 / 100
	}
	return 0
}
