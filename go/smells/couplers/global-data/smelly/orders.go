// Package smelly illustrates Global Data: the discount rate and the order
// counter are package variables anyone can read and modify. It is
// impossible to know who changed them and tests contaminate each other.
package smelly

import "fmt"

// SMELL: Global Data. Mutable state shared by the whole program.
var (
	DiscountRate = 0.0
	orderCount   = 0
)

// PlaceOrder records an order and returns its id and total.
func PlaceOrder(amount float64) (string, float64) {
	orderCount++
	return fmt.Sprintf("ORD-%03d", orderCount), amount * (1 - DiscountRate)
}

// StartSale enables the sale for the *whole* program.
// SMELL: action at a distance; any function can alter prices.
func StartSale() { DiscountRate = 0.2 }

// Reset exists only so tests can survive the global state.
func Reset() { DiscountRate, orderCount = 0, 0 }
