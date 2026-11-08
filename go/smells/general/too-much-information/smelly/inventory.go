// Package smelly exposes inventory internals: exported fields anyone can
// modify and helper methods that should be private.
package smelly

// Inventory tracks stock per SKU.
//
// SMELL: everything exported. Callers can touch Items or Reserved directly
// and break the "reserved <= available" invariant.
type Inventory struct {
	Items    map[string]int
	Reserved map[string]int
	Dirty    bool
}

// NewInventory creates an empty inventory.
func NewInventory() *Inventory {
	return &Inventory{Items: map[string]int{}, Reserved: map[string]int{}}
}

// AddStock increases the stock of a SKU.
func (i *Inventory) AddStock(sku string, qty int) { i.Items[sku] += qty; i.MarkDirty() }

// Reserve reserves units if available.
func (i *Inventory) Reserve(sku string, qty int) bool {
	if i.FreeUnits(sku) < qty {
		return false
	}
	i.Reserved[sku] += qty
	i.MarkDirty()
	return true
}

// FreeUnits SMELL: an internal helper turned into public API.
func (i *Inventory) FreeUnits(sku string) int { return i.Items[sku] - i.Reserved[sku] }

// MarkDirty SMELL: a persistence detail nobody outside should call.
func (i *Inventory) MarkDirty() { i.Dirty = true }
