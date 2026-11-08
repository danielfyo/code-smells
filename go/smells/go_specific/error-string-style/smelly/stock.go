// Package smelly writes error messages with a capital letter, trailing
// punctuation and no context, which read badly when chained.
package smelly

import (
	"errors"
	"fmt"
)

// SMELL: capital letter and trailing period. Once wrapped it reads
// "reserve tea: Not enough stock!." in the middle of a sentence.
var ErrNoStock = errors.New("Not enough stock!.")

// Reserve reserves units.
func Reserve(stock map[string]int, sku string, qty int) error {
	if _, ok := stock[sku]; !ok {
		// SMELL: no context (which product?) and sentence formatting.
		return errors.New("Error: Product not found.")
	}
	if stock[sku] < qty {
		return fmt.Errorf("reserve %s: %w", sku, ErrNoStock)
	}
	stock[sku] -= qty
	return nil
}
