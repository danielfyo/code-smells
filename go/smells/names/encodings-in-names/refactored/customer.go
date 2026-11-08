// Package refactored removes type encodings from names: the compiler and the
// editor already know the types.
package refactored

// CustomerRepository retrieves customers.
//
// REFACTOR: no I prefix; Go interface names describe the role.
type CustomerRepository interface {
	FindByID(id string) (Customer, bool)
}

// Customer is a customer.
//
// REFACTOR: Rename Field; str/int/b are dropped from the names.
type Customer struct {
	Name  string
	Age   int
	Adult bool
}

// MemoryCustomerRepository is an in-memory implementation.
type MemoryCustomerRepository struct {
	customers map[string]Customer
}

// NewMemoryCustomerRepository creates the repository with the given customers.
func NewMemoryCustomerRepository(customers map[string]Customer) MemoryCustomerRepository {
	return MemoryCustomerRepository{customers: customers}
}

// FindByID looks a customer up by id.
func (r MemoryCustomerRepository) FindByID(id string) (Customer, bool) {
	c, ok := r.customers[id]
	return c, ok
}
