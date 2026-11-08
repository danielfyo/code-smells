// Package smelly illustrates the Long Method smell: a single function
// validates, computes, applies discounts and taxes and formats the result.
// Everything is mixed in one block that is hard to read, test and reuse.
package smelly

import (
	"errors"
	"fmt"
	"strings"
)

// Line is an order line.
type Line struct {
	SKU      string
	Quantity int
	Price    float64
}

// BuildInvoice renders the text of an invoice.
// SMELL: Long Method. The function does five different things (validate,
// sum, discount, apply VAT and format) and each block needs a comment to
// explain what it does: a clear sign that it should be extracted.
func BuildInvoice(customer string, lines []Line, vip bool) (string, error) {
	// validation
	if strings.TrimSpace(customer) == "" {
		return "", errors.New("customer is required")
	}
	if len(lines) == 0 {
		return "", errors.New("order has no lines")
	}
	for _, l := range lines {
		if l.Quantity <= 0 {
			return "", fmt.Errorf("invalid quantity for %s", l.SKU)
		}
	}
	// subtotal
	subtotal := 0.0
	for _, l := range lines {
		subtotal += float64(l.Quantity) * l.Price
	}
	// discount
	discount := 0.0
	if vip {
		discount = subtotal * 0.10
	} else if subtotal > 500 {
		discount = subtotal * 0.05
	}
	// taxes
	taxable := subtotal - discount
	tax := taxable * 0.21
	total := taxable + tax
	// formatting
	var b strings.Builder
	fmt.Fprintf(&b, "Invoice for %s\n", customer)
	for _, l := range lines {
		fmt.Fprintf(&b, "%s x%d %.2f\n", l.SKU, l.Quantity, float64(l.Quantity)*l.Price)
	}
	fmt.Fprintf(&b, "Subtotal: %.2f\n", subtotal)
	fmt.Fprintf(&b, "Discount: %.2f\n", discount)
	fmt.Fprintf(&b, "Tax: %.2f\n", tax)
	fmt.Fprintf(&b, "Total: %.2f\n", total)
	return b.String(), nil
}
