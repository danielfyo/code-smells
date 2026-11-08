// Package refactored fixes Data Clumps by extracting the group of data into
// an Address type that also attracts the behavior that used to be scattered.
package refactored

import (
	"fmt"
	"strings"
)

// Address groups the data that always travelled together.
// REFACTOR: Extract Class / Introduce Parameter Object.
type Address struct {
	Street, City, Zip string
}

// IsValid validates the address. REFACTOR: Move Function into the new type.
func (a Address) IsValid() bool {
	return a.Street != "" && a.City != "" && len(a.Zip) == 5
}

// IsIsland reports whether the postal code belongs to the Balearic or Canary Islands.
func (a Address) IsIsland() bool {
	for _, p := range []string{"07", "35", "38"} {
		if strings.HasPrefix(a.Zip, p) {
			return true
		}
	}
	return false
}

// ShippingCost depends only on the address.
func (a Address) ShippingCost() float64 {
	if a.IsIsland() {
		return 15
	}
	return 5
}

// Label builds the shipping label.
func (a Address) Label(name string) string {
	return fmt.Sprintf("%s\n%s\n%s %s", name, a.Street, a.Zip, strings.ToUpper(a.City))
}

// Customer holds an Address instead of three loose fields.
type Customer struct {
	Name    string
	Address Address
}

// Ship prepares a shipment for the customer.
func Ship(c Customer) (string, float64, error) {
	if !c.Address.IsValid() {
		return "", 0, fmt.Errorf("invalid address for %s", c.Name)
	}
	return c.Address.Label(c.Name), c.Address.ShippingCost(), nil
}
