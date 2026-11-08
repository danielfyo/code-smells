// Package smelly shows inconsistent names: the same concept appears as
// user/client/customer and the same operation as Fetch/Get/Retrieve.
package smelly

// Customer is a customer.
type Customer struct {
	ID    string
	Email string
}

// Store keeps customers in memory.
type Store struct {
	data map[string]Customer
}

// NewStore creates a store with the given customers.
func NewStore(cs ...Customer) *Store {
	s := &Store{data: map[string]Customer{}}
	for _, c := range cs {
		s.data[c.ID] = c
	}
	return s
}

// FetchUser SMELL: "Fetch" + "User" for what everywhere else is a Customer.
func (s *Store) FetchUser(id string) (Customer, bool) {
	c, ok := s.data[id]
	return c, ok
}

// GetClientEmail SMELL: now "Get" and "Client" for the same concept.
func (s *Store) GetClientEmail(id string) string {
	return s.data[id].Email
}

// RetrieveCustomerCount SMELL: and here "Retrieve". Are these different
// operations? The reader cannot tell without reading the code.
func (s *Store) RetrieveCustomerCount() int { return len(s.data) }
