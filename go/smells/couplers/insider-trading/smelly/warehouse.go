// Package smelly illustrates Insider Trading: Warehouse and Dispatcher pass
// internal data through the back door. Dispatcher modifies the warehouse's
// stock map directly and the warehouse reads the dispatcher's internal
// queue. Neither can change its implementation without breaking the other.
package smelly

import "errors"

// Warehouse keeps stock.
// SMELL: Insider Trading. Fields exported only so another module can touch them.
type Warehouse struct {
	Stock      map[string]int
	Dispatcher *Dispatcher
}

// Dispatcher organizes shipments.
type Dispatcher struct {
	Queue []string // SMELL: internal state exposed
}

// Ship reserves and queues a shipment.
// SMELL: it manipulates the warehouse's internal map bypassing any rule.
func (d *Dispatcher) Ship(w *Warehouse, sku string) error {
	if w.Stock[sku] <= 0 {
		return errors.New("out of stock")
	}
	w.Stock[sku]--
	d.Queue = append(d.Queue, sku)
	return nil
}

// Pending counts pending shipments for a SKU by reading someone else's queue.
func (w *Warehouse) Pending(sku string) int {
	n := 0
	for _, s := range w.Dispatcher.Queue {
		if s == sku {
			n++
		}
	}
	return n
}
