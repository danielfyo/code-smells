// Package refactored follows Go's error style: lower case, no trailing
// punctuation and the context needed to diagnose.
package refactored

import (
	"errors"
	"fmt"
)

// REFACTOR: lower-case messages without trailing punctuation, designed to be
// concatenated: "reserve tea: not enough stock".
var (
	ErrNoStock  = errors.New("not enough stock")
	ErrNotFound = errors.New("product not found")
)

// Reserve reserves units.
func Reserve(stock map[string]int, sku string, qty int) error {
	available, ok := stock[sku]
	if !ok {
		return fmt.Errorf("reserve %s: %w", sku, ErrNotFound)
	}
	if available < qty {
		return fmt.Errorf("reserve %s: %w (have %d, want %d)", sku, ErrNoStock, available, qty)
	}
	stock[sku] -= qty
	return nil
}
