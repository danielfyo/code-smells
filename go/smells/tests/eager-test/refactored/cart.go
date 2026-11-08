// Package refactored holds the production code (a shopping cart); the smell lives
// in the test file.
package refactored

import "errors"

// ErrUnknownItem means the item is not in the cart.
var ErrUnknownItem = errors.New("item not in cart")

// Cart is a cart: SKU → units, with prices per SKU.
type Cart struct {
	qty    map[string]int
	prices map[string]int64
}

// NewCart creates a cart with the given price list.
func NewCart(prices map[string]int64) *Cart {
	return &Cart{qty: map[string]int{}, prices: prices}
}

// Add adds units of an item.
func (c *Cart) Add(sku string, n int) { c.qty[sku] += n }

// Remove removes an item entirely.
func (c *Cart) Remove(sku string) error {
	if _, ok := c.qty[sku]; !ok {
		return ErrUnknownItem
	}
	delete(c.qty, sku)
	return nil
}

// Count returns the total number of units.
func (c *Cart) Count() int {
	n := 0
	for _, q := range c.qty {
		n += q
	}
	return n
}

// Total returns the amount in cents.
func (c *Cart) Total() int64 {
	var t int64
	for sku, q := range c.qty {
		t += c.prices[sku] * int64(q)
	}
	return t
}
