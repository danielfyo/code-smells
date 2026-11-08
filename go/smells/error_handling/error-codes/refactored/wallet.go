// Package refactored fixes Returning Error Codes with Go's idiomatic
// mechanism: a second return value of type error, with sentinel errors that
// can be checked with errors.Is.
package refactored

import (
	"errors"
	"fmt"
)

// Sentinel errors. REFACTOR: Replace Error Code with Exception (in Go, error).
var (
	ErrInvalidAmount = errors.New("invalid amount")
	ErrInsufficient  = errors.New("insufficient funds")
	ErrLocked        = errors.New("wallet locked")
)

// Wallet is a wallet in cents.
type Wallet struct {
	Balance int
	Locked  bool
}

// Withdraw takes money out and returns the remaining balance or an error.
func (w *Wallet) Withdraw(amount int) (int, error) {
	if w.Locked {
		return w.Balance, ErrLocked
	}
	if amount <= 0 {
		return w.Balance, fmt.Errorf("%w: %d", ErrInvalidAmount, amount)
	}
	if amount > w.Balance {
		return w.Balance, fmt.Errorf("%w: need %d, have %d", ErrInsufficient, amount, w.Balance)
	}
	w.Balance -= amount
	return w.Balance, nil
}
