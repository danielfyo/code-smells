// Package refactored uses a single term per concept (Customer) and per
// operation (Find), so the vocabulary is predictable.
package refactored

// Customer is a customer.
type Customer struct {
	ID    string
	Email string
}

// CustomerStore keeps customers in memory.
type CustomerStore struct {
	customers map[string]Customer
}

// NewCustomerStore creates a store with the given customers.
func NewCustomerStore(cs ...Customer) *CustomerStore {
	s := &CustomerStore{customers: map[string]Customer{}}
	for _, c := range cs {
		s.customers[c.ID] = c
	}
	return s
}

// REFACTOR: Rename Method to unify the vocabulary: always "Customer" and
// always "Find" for queries.

// FindCustomer looks a customer up by id.
func (s *CustomerStore) FindCustomer(id string) (Customer, bool) {
	c, ok := s.customers[id]
	return c, ok
}

// FindCustomerEmail returns the customer's email (empty if not found).
func (s *CustomerStore) FindCustomerEmail(id string) string {
	return s.customers[id].Email
}

// CustomerCount returns how many customers there are.
func (s *CustomerStore) CustomerCount() int { return len(s.customers) }
