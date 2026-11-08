// Package smelly shows redundant comments that repeat what the code already
// says clearly.
package smelly

// SMELL: "Cart is a cart" adds nothing the name does not already say.
// Cart is a cart.
type Cart struct {
	// SMELL: a comment that repeats the field name.
	// Items are the items.
	Items []Item
}

// Item is an item.
type Item struct {
	// Price is the price.
	Price int64
	// Quantity is the quantity.
	Quantity int
}

// Add adds an item.
func (c *Cart) Add(it Item) {
	// SMELL: narrating every line duplicates the code and doubles maintenance.
	// append the item to the items slice
	c.Items = append(c.Items, it)
}

// Total returns the total.
func (c *Cart) Total() int64 {
	// inicializar total a cero
	var total int64
	// loop over the items
	for _, it := range c.Items {
		// add price times quantity to the total
		total += it.Price * int64(it.Quantity)
	}
	// return the total
	return total
}
