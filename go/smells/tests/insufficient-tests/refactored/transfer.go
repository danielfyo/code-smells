// Package refactored holds the production code (transfers between accounts); the
// smell lives in the test file.
package refactored

import (
	"errors"
	"fmt"
)

// Transfer errors.
var (
	ErrInvalidAmount     = errors.New("amount must be positive")
	ErrInsufficientFunds = errors.New("insufficient funds")
	ErrSameAccount       = errors.New("cannot transfer to the same account")
)

// Account is a bank account with a balance in cents.
type Account struct {
	ID      string
	Balance int64
}

// Transfer moves money from from to to.
func Transfer(from, to *Account, cents int64) error {
	switch {
	case cents <= 0:
		return fmt.Errorf("transfer %d: %w", cents, ErrInvalidAmount)
	case from.ID == to.ID:
		return fmt.Errorf("transfer %s: %w", from.ID, ErrSameAccount)
	case from.Balance < cents:
		return fmt.Errorf("transfer from %s: %w", from.ID, ErrInsufficientFunds)
	}
	from.Balance -= cents
	to.Balance += cents
	return nil
}
