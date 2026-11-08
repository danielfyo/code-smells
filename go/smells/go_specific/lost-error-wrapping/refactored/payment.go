// Package refactored wraps with %w and compares with errors.Is, so context is
// added without losing the identity of the error.
package refactored

import (
	"errors"
	"fmt"
)

// ErrCardDeclined means the bank declined the card.
var ErrCardDeclined = errors.New("card declined")

func chargeCard(cents int64) error {
	if cents > 10000 {
		return ErrCardDeclined
	}
	return nil
}

// Pay charges an order.
//
// REFACTOR: %w keeps the original error inside the chain.
func Pay(orderID string, cents int64) error {
	if err := chargeCard(cents); err != nil {
		return fmt.Errorf("pay order %s: %w", orderID, err)
	}
	return nil
}

// IsDeclined uses errors.Is, which walks the whole chain of wrappers.
func IsDeclined(err error) bool { return errors.Is(err, ErrCardDeclined) }
