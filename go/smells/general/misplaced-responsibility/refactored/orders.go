// Package refactored moves the total calculation to the Order type, where
// everybody would look for it; the email only formats.
package refactored

import "fmt"

// Line is an order line.
type Line struct {
	PriceCents int64
	Qty        int
}

// Order is an order.
type Order struct {
	ID    string
	Lines []Line
}

const (
	volumeDiscountThresholdCents = 10000
	volumeDiscountPercent        = 5
)

// Total returns the order amount after the volume discount.
//
// REFACTOR: Move Function; the business rule belongs to the order.
func (o Order) Total() int64 {
	var total int64
	for _, l := range o.Lines {
		total += l.PriceCents * int64(l.Qty)
	}
	if total > volumeDiscountThresholdCents {
		total -= total * volumeDiscountPercent / 100
	}
	return total
}

// ConfirmationEmail composes the confirmation email.
func ConfirmationEmail(o Order) string {
	return fmt.Sprintf("Order %s confirmed. Total: %d cents", o.ID, o.Total())
}
