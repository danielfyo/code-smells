// Package smelly relies on a convention ("if you add a payment method,
// remember to add its case in Fee and Label") instead of letting the
// structure enforce it.
package smelly

// Payment methods.
// SMELL: IMPORTANT: if you add one, remember to add its case in Fee and Label.
const (
	Card = iota
	Transfer
	PayPal
)

// Fee returns the fee in cents.
func Fee(method int, amountCents int64) int64 {
	switch method {
	case Card:
		return amountCents * 2 / 100
	case Transfer:
		return 50
	}
	// SMELL: someone added PayPal and forgot this switch: a silent 0 fee.
	return 0
}

// Label returns the display name of the method.
func Label(method int) string {
	switch method {
	case Card:
		return "Card"
	case Transfer:
		return "Bank transfer"
	case PayPal:
		return "PayPal"
	}
	return "?"
}
