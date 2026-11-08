// Package refactored fixes Primitive Obsession by creating domain value
// types (Email, Money) that are validated on construction and own their rules.
package refactored

import (
	"errors"
	"fmt"
	"strings"
)

// Email is an already validated and normalized address.
// REFACTOR: Replace Primitive with Object (named type + constructor).
type Email string

// ParseEmail validates and normalizes the email exactly once.
func ParseEmail(s string) (Email, error) {
	if !strings.Contains(s, "@") || strings.HasPrefix(s, "@") {
		return "", fmt.Errorf("invalid email %q", s)
	}
	return Email(strings.ToLower(s)), nil
}

// Money is an amount in cents in a currency.
// REFACTOR: Replace Data Value with Object (Whole Value).
type Money struct {
	cents    int64
	currency string
}

// ErrCurrencyMismatch is returned when mixing different currencies.
var ErrCurrencyMismatch = errors.New("currency mismatch")

// NewMoney validates the amount and the currency.
func NewMoney(cents int64, currency string) (Money, error) {
	if cents < 0 {
		return Money{}, errors.New("negative amount")
	}
	if len(currency) != 3 {
		return Money{}, fmt.Errorf("invalid currency %q", currency)
	}
	return Money{cents, strings.ToUpper(currency)}, nil
}

// Add sums respecting the currency. REFACTOR: Move Method (rule inside the value).
func (m Money) Add(o Money) (Money, error) {
	if m.currency == "" {
		return o, nil
	}
	if o.currency != m.currency {
		return Money{}, ErrCurrencyMismatch
	}
	return Money{m.cents + o.cents, m.currency}, nil
}

// String formats the amount.
func (m Money) String() string {
	if m.currency == "" {
		return "0.00"
	}
	return fmt.Sprintf("%d.%02d %s", m.cents/100, m.cents%100, m.currency)
}

// Payment uses domain types instead of primitives.
type Payment struct {
	Email  Email
	Amount Money
}

// Total sums the payments.
func Total(payments []Payment) (string, error) {
	var sum Money
	for _, p := range payments {
		var err error
		if sum, err = sum.Add(p.Amount); err != nil {
			return "", err
		}
	}
	return sum.String(), nil
}
