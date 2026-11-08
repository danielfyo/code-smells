// Package refactored applies "accept interfaces, return structs": the
// producer exposes a concrete type and the consumer declares the minimal
// interface it uses.
package refactored

// OrderRepository is the in-memory order store (concrete type).
//
// REFACTOR: Remove Interface on the producer side; the struct is returned.
type OrderRepository struct {
	orders map[string]int64
}

// NewOrderRepository creates an empty repository.
func NewOrderRepository() *OrderRepository {
	return &OrderRepository{orders: map[string]int64{}}
}

// Save stores an order.
func (r *OrderRepository) Save(id string, cents int64) { r.orders[id] = cents }

// Find looks an order up.
func (r *OrderRepository) Find(id string) (int64, bool) {
	c, ok := r.orders[id]
	return c, ok
}

// Delete removes an order.
func (r *OrderRepository) Delete(id string) { delete(r.orders, id) }

// Count returns the number of orders.
func (r *OrderRepository) Count() int { return len(r.orders) }

// orderFinder is the minimal interface InvoiceTotal needs.
//
// REFACTOR: the consumer defines the interface, with a single method; any
// type (the real repository or a test double) satisfies it implicitly.
type orderFinder interface {
	Find(id string) (int64, bool)
}

// InvoiceTotal sums the amounts of the existing orders.
func InvoiceTotal(repo orderFinder, ids []string) int64 {
	var total int64
	for _, id := range ids {
		if c, ok := repo.Find(id); ok {
			total += c
		}
	}
	return total
}
