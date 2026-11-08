// Package refactored fixes Insider Trading by replacing access to internal
// data with explicit interfaces: the warehouse offers Reserve and the
// dispatcher offers Pending. Each one keeps its state private.
package refactored

import "errors"

// ErrOutOfStock reports that no units are left.
var ErrOutOfStock = errors.New("out of stock")

// Reserver is all Dispatcher needs from the warehouse.
// REFACTOR: Move Function + Hide Delegate + Extract Interface.
type Reserver interface{ Reserve(sku string) error }

// Warehouse keeps its stock private.
type Warehouse struct{ stock map[string]int }

// NewWarehouse creates a warehouse with initial stock.
func NewWarehouse(stock map[string]int) *Warehouse {
	cp := make(map[string]int, len(stock))
	for k, v := range stock {
		cp[k] = v
	}
	return &Warehouse{stock: cp}
}

// Reserve takes one unit applying its own rules.
func (w *Warehouse) Reserve(sku string) error {
	if w.stock[sku] <= 0 {
		return ErrOutOfStock
	}
	w.stock[sku]--
	return nil
}

// Available returns the available units.
func (w *Warehouse) Available(sku string) int { return w.stock[sku] }

// Dispatcher organizes shipments with its private queue.
type Dispatcher struct {
	source Reserver
	queue  []string
}

// NewDispatcher connects the dispatcher with whoever reserves stock.
func NewDispatcher(r Reserver) *Dispatcher { return &Dispatcher{source: r} }

// Ship reserves and queues a shipment.
func (d *Dispatcher) Ship(sku string) error {
	if err := d.source.Reserve(sku); err != nil {
		return err
	}
	d.queue = append(d.queue, sku)
	return nil
}

// Pending counts pending shipments for a SKU.
func (d *Dispatcher) Pending(sku string) int {
	n := 0
	for _, s := range d.queue {
		if s == sku {
			n++
		}
	}
	return n
}
