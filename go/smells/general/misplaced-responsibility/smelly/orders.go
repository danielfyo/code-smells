// Package smelly puts a business rule where it was convenient for the author
// (the email formatter) instead of where readers would look for it (Order).
package smelly

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

// ConfirmationEmail composes the confirmation email.
//
// SMELL: the total calculation (and the volume discount) lives in the email
// code. Whoever looks for "how an order total is computed" will not look
// here, and the invoice will end up with its own diverging copy.
func ConfirmationEmail(o Order) string {
	var total int64
	for _, l := range o.Lines {
		total += l.PriceCents * int64(l.Qty)
	}
	if total > 10000 {
		total -= total * 5 / 100
	}
	return fmt.Sprintf("Order %s confirmed. Total: %d cents", o.ID, total)
}
