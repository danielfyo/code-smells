// Package refactored fixes Long Method by splitting the function into small
// named steps: each one can be read, tested and reused on its own, and the
// main function tells the story at a high level.
package refactored

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

// Amount returns the line amount.
// REFACTOR: Extract Method. The repeated calculation gets a name.
func (l Line) Amount() float64 { return float64(l.Quantity) * l.Price }

const (
	vipDiscountRate  = 0.10
	bulkDiscountRate = 0.05
	bulkThreshold    = 500.0
	vatRate          = 0.21
)

// totals groups the computed amounts.
type totals struct {
	subtotal, discount, tax, total float64
}

// BuildInvoice renders the text of an invoice.
// REFACTOR: Compose Method. The function orchestrates named steps.
func BuildInvoice(customer string, lines []Line, vip bool) (string, error) {
	if err := validate(customer, lines); err != nil {
		return "", err
	}
	return format(customer, lines, computeTotals(lines, vip)), nil
}

// REFACTOR: Extract Method (validation).
func validate(customer string, lines []Line) error {
	if strings.TrimSpace(customer) == "" {
		return errors.New("customer is required")
	}
	if len(lines) == 0 {
		return errors.New("order has no lines")
	}
	for _, l := range lines {
		if l.Quantity <= 0 {
			return fmt.Errorf("invalid quantity for %s", l.SKU)
		}
	}
	return nil
}

func subtotal(lines []Line) float64 {
	sum := 0.0
	for _, l := range lines {
		sum += l.Amount()
	}
	return sum
}

// REFACTOR: Extract Method + Replace Magic Number with Symbolic Constant.
func discountFor(subtotal float64, vip bool) float64 {
	switch {
	case vip:
		return subtotal * vipDiscountRate
	case subtotal > bulkThreshold:
		return subtotal * bulkDiscountRate
	default:
		return 0
	}
}

func computeTotals(lines []Line, vip bool) totals {
	s := subtotal(lines)
	d := discountFor(s, vip)
	tax := (s - d) * vatRate
	return totals{subtotal: s, discount: d, tax: tax, total: s - d + tax}
}

// REFACTOR: Extract Method (presentation separated from calculation).
func format(customer string, lines []Line, t totals) string {
	var b strings.Builder
	fmt.Fprintf(&b, "Invoice for %s\n", customer)
	for _, l := range lines {
		fmt.Fprintf(&b, "%s x%d %.2f\n", l.SKU, l.Quantity, l.Amount())
	}
	fmt.Fprintf(&b, "Subtotal: %.2f\n", t.subtotal)
	fmt.Fprintf(&b, "Discount: %.2f\n", t.discount)
	fmt.Fprintf(&b, "Tax: %.2f\n", t.tax)
	fmt.Fprintf(&b, "Total: %.2f\n", t.total)
	return b.String()
}
