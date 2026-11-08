// Package smelly defines interfaces on the producer side "just in case", with
// a single implementation, and returns the interface instead of the concrete type.
package smelly

// OrderRepository SMELL: wide interface declared next to its only
// implementation. No consumer needs all of it; it only adds indirection and
// forces maintaining two lists of methods.
type OrderRepository interface {
	Save(id string, cents int64)
	Find(id string) (int64, bool)
	Delete(id string)
	Count() int
}

type memoryOrderRepository struct {
	orders map[string]int64
}

// NewOrderRepository SMELL: returns the interface; callers lose access to any
// extra method and cannot see the real type.
func NewOrderRepository() OrderRepository {
	return &memoryOrderRepository{orders: map[string]int64{}}
}

func (r *memoryOrderRepository) Save(id string, cents int64) { r.orders[id] = cents }
func (r *memoryOrderRepository) Find(id string) (int64, bool) {
	c, ok := r.orders[id]
	return c, ok
}
func (r *memoryOrderRepository) Delete(id string) { delete(r.orders, id) }
func (r *memoryOrderRepository) Count() int       { return len(r.orders) }

// InvoiceTotal only needs Find, but depends on the whole interface.
func InvoiceTotal(repo OrderRepository, ids []string) int64 {
	var total int64
	for _, id := range ids {
		if c, ok := repo.Find(id); ok {
			total += c
		}
	}
	return total
}
