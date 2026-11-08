// Package refactored exposes a narrow interface: what is needed to use the
// inventory and nothing else. Details stay unexported.
package refactored

// Inventory tracks stock per SKU.
//
// REFACTOR: Encapsulate Field / Hide Method. State and internal helpers are
// unexported; the invariant can only change through the API.
type Inventory struct {
	items    map[string]int
	reserved map[string]int
	dirty    bool
}

// NewInventory creates an empty inventory.
func NewInventory() *Inventory {
	return &Inventory{items: map[string]int{}, reserved: map[string]int{}}
}

// AddStock increases the stock of a SKU.
func (i *Inventory) AddStock(sku string, qty int) {
	i.items[sku] += qty
	i.dirty = true
}

// Reserve reserves units if available.
func (i *Inventory) Reserve(sku string, qty int) bool {
	if i.available(sku) < qty {
		return false
	}
	i.reserved[sku] += qty
	i.dirty = true
	return true
}

// Available returns the free units (read only).
func (i *Inventory) Available(sku string) int { return i.available(sku) }

func (i *Inventory) available(sku string) int { return i.items[sku] - i.reserved[sku] }
