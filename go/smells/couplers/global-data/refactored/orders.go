// Package refactored fixes Global Data by encapsulating the state in a
// value (Shop) that is created and passed explicitly. Each instance is
// independent and changes have a clear owner.
package refactored

import "fmt"

// Shop holds the state that used to be global.
// REFACTOR: Encapsulate Variable + explicit dependency passing.
type Shop struct {
	discountRate float64
	orderCount   int
}

// PlaceOrder records an order and returns its id and total.
func (s *Shop) PlaceOrder(amount float64) (string, float64) {
	s.orderCount++
	return fmt.Sprintf("ORD-%03d", s.orderCount), amount * (1 - s.discountRate)
}

// StartSale enables the sale only in this shop.
func (s *Shop) StartSale() { s.discountRate = 0.2 }
