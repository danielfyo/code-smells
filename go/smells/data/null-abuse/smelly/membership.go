// Package smelly illustrates Null Check / Null Abuse adapted to Go: lookups
// return nil pointers for "not found" and optional fields are pointers, so
// every client fills up with != nil checks (and the day one is forgotten,
// it panics).
package smelly

// Membership is a customer's subscription.
type Membership struct{ DiscountPct int }

// Customer is a customer; Membership may be nil.
type Customer struct {
	ID         string
	Membership *Membership
}

// Directory stores customers.
type Directory struct{ customers map[string]*Customer }

// NewDirectory creates a directory.
func NewDirectory(cs ...*Customer) *Directory {
	d := &Directory{customers: map[string]*Customer{}}
	for _, c := range cs {
		d.customers[c.ID] = c
	}
	return d
}

// Find returns nil if the customer does not exist.
// SMELL: nil as a sentinel value for "not found".
func (d *Directory) Find(id string) *Customer { return d.customers[id] }

// Price computes the final price.
// SMELL: Null Abuse. Cascading nil checks.
func (d *Directory) Price(id string, base float64) float64 {
	c := d.Find(id)
	if c == nil {
		return base
	}
	if c.Membership == nil {
		return base
	}
	return base * float64(100-c.Membership.DiscountPct) / 100
}

// MemberDiscount forgets one check and can panic.
// SMELL: the typical latent nil bug.
func (d *Directory) MemberDiscount(id string) int {
	return d.Find(id).Membership.DiscountPct
}
