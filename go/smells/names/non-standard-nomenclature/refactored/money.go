// Package refactored adopts Go's standard nomenclature: NewX as constructor,
// String() as fmt.Stringer and Factory for the factory.
package refactored

import "fmt"

// Money is an amount in cents with its currency.
type Money struct {
	Cents    int64
	Currency string
}

// NewMoney creates an amount.
//
// REFACTOR: Rename Function to the NewX convention.
func NewMoney(cents int64, currency string) Money {
	return Money{Cents: cents, Currency: currency}
}

// String implements fmt.Stringer.
//
// REFACTOR: Rename Method to String(); fmt now uses it automatically.
func (m Money) String() string {
	return fmt.Sprintf("%d.%02d %s", m.Cents/100, m.Cents%100, m.Currency)
}

// MoneyFactory creates amounts in a fixed currency; the name states the pattern.
type MoneyFactory struct{ Currency string }

// New creates a Money in the factory's currency.
func (f MoneyFactory) New(cents int64) Money { return NewMoney(cents, f.Currency) }
