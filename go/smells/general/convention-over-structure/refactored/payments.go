// Package refactored lets the structure enforce the rule: each payment method
// is a type implementing an interface, and the compiler demands Fee and Label
// for all of them.
package refactored

// PaymentMethod is a payment method.
//
// REFACTOR: Replace Conditional with Polymorphism. Adding a method without
// Fee or Label no longer compiles; there is nothing to remember.
type PaymentMethod interface {
	Fee(amountCents int64) int64
	Label() string
}

// Card is a card payment.
type Card struct{}

// Fee implementa PaymentMethod.
func (Card) Fee(amountCents int64) int64 { return amountCents * 2 / 100 }

// Label implementa PaymentMethod.
func (Card) Label() string { return "Card" }

// Transfer is a bank transfer.
type Transfer struct{}

// Fee implementa PaymentMethod.
func (Transfer) Fee(int64) int64 { return 50 }

// Label implementa PaymentMethod.
func (Transfer) Label() string { return "Bank transfer" }

// PayPal is a PayPal payment.
type PayPal struct{}

// Fee implements PaymentMethod: the compiler forced a decision on its fee.
func (PayPal) Fee(amountCents int64) int64 { return amountCents*3/100 + 35 }

// Label implementa PaymentMethod.
func (PayPal) Label() string { return "PayPal" }

// Compile-time checks.
var (
	_ PaymentMethod = Card{}
	_ PaymentMethod = Transfer{}
	_ PaymentMethod = PayPal{}
)
