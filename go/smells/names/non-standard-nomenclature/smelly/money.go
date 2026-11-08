// Package smelly ignores well-known Go conventions: text representation
// methods, constructors and pattern names.
package smelly

import "fmt"

// Money is an amount in cents with its currency.
type Money struct {
	Cents    int64
	Currency string
}

// CreateMoneyObject SMELL: in Go constructors are called NewX.
func CreateMoneyObject(cents int64, currency string) Money {
	return Money{Cents: cents, Currency: currency}
}

// ToText SMELL: the convention is String() (fmt.Stringer); with any other
// name fmt.Println ignores it and readers do not recognize it.
func (m Money) ToText() string {
	return fmt.Sprintf("%d.%02d %s", m.Cents/100, m.Cents%100, m.Currency)
}

// MoneyMaker SMELL: it is a factory but is not called one; the pattern is hidden.
type MoneyMaker struct{ Currency string }

// Make creates a Money in the maker's currency.
func (f MoneyMaker) Make(cents int64) Money { return CreateMoneyObject(cents, f.Currency) }
