// Package refactored flattens the pyramid: in Go concurrency does not need
// callbacks; functions return (result, error) and the flow is linear.
package refactored

import (
	"errors"
	"fmt"
)

// ErrOutOfStock means there is no stock left.
var ErrOutOfStock = errors.New("out of stock")

// Services simulates the checkout operations.
type Services struct {
	OutOfStock bool
	Log        []string
}

// Reserve reserves stock.
func (s *Services) Reserve(sku string) error {
	if s.OutOfStock {
		return ErrOutOfStock
	}
	s.Log = append(s.Log, "reserved "+sku)
	return nil
}

// Charge charges and returns the payment id.
func (s *Services) Charge(cents int64) (string, error) {
	s.Log = append(s.Log, "charged")
	return "pay-1", nil
}

// Ship creates the shipment and returns the tracking number.
func (s *Services) Ship(paymentID string) (string, error) {
	s.Log = append(s.Log, "shipped "+paymentID)
	return "TRK-1", nil
}

// Checkout runs the purchase process step by step.
//
// REFACTOR: Replace Callbacks with sequential calls + guard clauses. If
// asynchrony is needed, the caller runs Checkout in a goroutine.
func Checkout(s *Services, sku string, cents int64) (string, error) {
	if err := s.Reserve(sku); err != nil {
		return "", fmt.Errorf("checkout: reserve: %w", err)
	}
	paymentID, err := s.Charge(cents)
	if err != nil {
		return "", fmt.Errorf("checkout: charge: %w", err)
	}
	tracking, err := s.Ship(paymentID)
	if err != nil {
		return "", fmt.Errorf("checkout: ship: %w", err)
	}
	return tracking, nil
}
