// Package smelly loses the error chain: it formats with %v instead of %w and
// compares with == instead of errors.Is.
package smelly

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
// SMELL: %v turns the error into text; the original error is lost and
// errors.Is(err, ErrCardDeclined) returns false.
func Pay(orderID string, cents int64) error {
	if err := chargeCard(cents); err != nil {
		return fmt.Errorf("pay order %s: %v", orderID, err)
	}
	return nil
}

// IsDeclined SMELL: compares with ==, which only works if nobody ever wraps
// the error. As soon as someone adds context, it stops detecting it.
func IsDeclined(err error) bool { return err == ErrCardDeclined }
