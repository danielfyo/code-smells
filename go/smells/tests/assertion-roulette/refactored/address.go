// Package refactored holds the production code (address parsing); the smell
// lives in the test file.
package refactored

import (
	"errors"
	"strings"
)

// Address is a postal address.
type Address struct {
	Street, City, PostalCode, Country string
}

// ParseAddress parses "street; city; postal code; country".
func ParseAddress(s string) (Address, error) {
	parts := strings.Split(s, ";")
	if len(parts) != 4 {
		return Address{}, errors.New("address must have 4 parts")
	}
	for i := range parts {
		parts[i] = strings.TrimSpace(parts[i])
	}
	return Address{parts[0], parts[1], parts[2], strings.ToUpper(parts[3])}, nil
}
