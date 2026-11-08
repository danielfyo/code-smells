// Package refactored uses names that reveal the intent of the code.
package refactored

// Order is a customer order with its amount in cents.
//
// REFACTOR: Rename Type / Rename Field. D, A, B and C become Order, ID,
// AmountCents and Paid.
type Order struct {
	ID          string
	AmountCents int64
	Paid        bool
}

// OutstandingAmount returns the sum of the amounts of the unpaid orders.
//
// REFACTOR: Rename Function and Rename Variable (Proc → OutstandingAmount,
// tmp → outstanding, data2 → orders).
func OutstandingAmount(orders []Order) int64 {
	var outstanding int64
	for _, order := range orders {
		if !order.Paid {
			outstanding += order.AmountCents
		}
	}
	return outstanding
}
