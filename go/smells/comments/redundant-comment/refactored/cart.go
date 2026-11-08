// Package refactored removes comments that merely paraphrase the code and
// keeps only those that add information the code cannot express.
package refactored

// Cart accumulates the lines of an order before it is paid.
type Cart struct {
	Items []Item
}

// Item is a cart line; Price is in cents.
//
// REFACTOR: the only non-obvious fact (the price unit) is documented; the
// remaining redundant comments were deleted.
type Item struct {
	Price    int64
	Quantity int
}

// Add appends a line to the cart.
func (c *Cart) Add(it Item) {
	c.Items = append(c.Items, it)
}

// Total returns the cart amount in cents.
func (c *Cart) Total() int64 {
	var total int64
	for _, it := range c.Items {
		total += it.Price * int64(it.Quantity)
	}
	return total
}
