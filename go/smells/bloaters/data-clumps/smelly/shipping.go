// Package smelly illustrates Data Clumps: street, city and postal code always
// travel together as loose parameters through several functions.
package smelly

import (
	"fmt"
	"strings"
)

// Customer stores its address as three loose fields.
// SMELL: Data Clumps. street/city/zip appear together everywhere.
type Customer struct {
	Name   string
	Street string
	City   string
	Zip    string
}

// FormatLabel builds the shipping label.
// SMELL: the same trio of parameters is repeated in every signature.
func FormatLabel(name, street, city, zip string) string {
	return fmt.Sprintf("%s\n%s\n%s %s", name, street, zip, strings.ToUpper(city))
}

// IsValidAddress validates the address.
func IsValidAddress(street, city, zip string) bool {
	return street != "" && city != "" && len(zip) == 5
}

// ShippingCost computes shipping based on the postal code.
func ShippingCost(street, city, zip string) float64 {
	// SMELL: street and city are unused; they are passed because they "go together".
	_, _ = street, city
	if strings.HasPrefix(zip, "07") || strings.HasPrefix(zip, "35") || strings.HasPrefix(zip, "38") {
		return 15 // islands
	}
	return 5
}

// Ship prepares a shipment for the customer.
func Ship(c Customer) (string, float64, error) {
	if !IsValidAddress(c.Street, c.City, c.Zip) {
		return "", 0, fmt.Errorf("invalid address for %s", c.Name)
	}
	return FormatLabel(c.Name, c.Street, c.City, c.Zip), ShippingCost(c.Street, c.City, c.Zip), nil
}
