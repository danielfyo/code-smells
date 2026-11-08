// Package smelly shows encodings in names: Hungarian notation, type prefixes
// and interfaces prefixed with "I".
package smelly

// ICustomerRepository SMELL: the I prefix is a convention from other
// languages; in Go it adds nothing.
type ICustomerRepository interface {
	FindByID(strID string) (StructCustomer, bool)
}

// StructCustomer SMELL: the kind of type ("Struct") embedded in the name.
type StructCustomer struct {
	StrName  string // SMELL: Hungarian notation (str)
	IntAge   int    // SMELL: Hungarian notation (int)
	BIsAdult bool   // SMELL: b prefix for booleans
}

// MapCustomerRepository is an in-memory implementation.
type MapCustomerRepository struct {
	MCustomers map[string]StructCustomer // SMELL: m prefix for "member" (m_)
}

// FindByID looks a customer up by id.
func (r MapCustomerRepository) FindByID(strID string) (StructCustomer, bool) {
	c, bOK := r.MCustomers[strID]
	return c, bOK
}
