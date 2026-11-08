// Package refactored fixes Null Abuse with two idiomatic Go techniques:
// explicit errors (or the "comma ok" idiom) for "not found" and a null
// object (a useful zero value) for the optional membership.
package refactored

import (
	"errors"
	"fmt"
)

// ErrNotFound reports that the customer does not exist.
var ErrNotFound = errors.New("customer not found")

// Membership is a value; its zero value (0%) is "no membership".
// REFACTOR: Introduce Special Case / Null Object (useful zero value).
type Membership struct{ DiscountPct int }

// Apply applies the discount; the zero value changes nothing.
func (m Membership) Apply(base float64) float64 {
	return base * float64(100-m.DiscountPct) / 100
}

// Customer is a customer; Membership is no longer a pointer.
type Customer struct {
	ID         string
	Membership Membership
}

// Directory stores customers.
type Directory struct{ customers map[string]Customer }

// NewDirectory creates a directory.
func NewDirectory(cs ...Customer) *Directory {
	d := &Directory{customers: map[string]Customer{}}
	for _, c := range cs {
		d.customers[c.ID] = c
	}
	return d
}

// Find returns an explicit error instead of nil.
// REFACTOR: Replace Null with Error.
func (d *Directory) Find(id string) (Customer, error) {
	c, ok := d.customers[id]
	if !ok {
		return Customer{}, fmt.Errorf("%w: %s", ErrNotFound, id)
	}
	return c, nil
}

// Price computes the final price; an unknown customer pays the base price.
func (d *Directory) Price(id string, base float64) float64 {
	c, err := d.Find(id)
	if err != nil {
		return base
	}
	return c.Membership.Apply(base)
}

// MemberDiscount reports the error instead of panicking.
func (d *Directory) MemberDiscount(id string) (int, error) {
	c, err := d.Find(id)
	if err != nil {
		return 0, err
	}
	return c.Membership.DiscountPct, nil
}
