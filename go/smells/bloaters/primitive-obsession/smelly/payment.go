// Package smelly illustrates Primitive Obsession: money is represented as a
// loose int and string and the email as a string, so validation and rules
// (do not add different currencies) are repeated or forgotten.
package smelly

import (
	"errors"
	"fmt"
	"strings"
)

// Payment is a charge to a customer.
// SMELL: Primitive Obsession. amountCents+currency form one concept
// (money) and email is a concept with rules, yet they are primitives.
type Payment struct {
	Email       string
	AmountCents int64
	Currency    string
}

// NewPayment validates each primitive by hand.
func NewPayment(email string, cents int64, currency string) (Payment, error) {
	// SMELL: email validation repeated wherever a string is received.
	if !strings.Contains(email, "@") || strings.HasPrefix(email, "@") {
		return Payment{}, fmt.Errorf("invalid email %q", email)
	}
	if cents < 0 {
		return Payment{}, errors.New("negative amount")
	}
	if len(currency) != 3 {
		return Payment{}, fmt.Errorf("invalid currency %q", currency)
	}
	return Payment{strings.ToLower(email), cents, strings.ToUpper(currency)}, nil
}

// Total sums payments.
// SMELL: the "same currency" rule and the formatting live outside the concept.
func Total(payments []Payment) (string, error) {
	if len(payments) == 0 {
		return "0.00", nil
	}
	cur := payments[0].Currency
	var sum int64
	for _, p := range payments {
		if p.Currency != cur {
			return "", errors.New("currency mismatch")
		}
		sum += p.AmountCents
	}
	return fmt.Sprintf("%d.%02d %s", sum/100, sum%100, cur), nil
}
