// Package smelly solves the same problem (formatting amounts) in three
// different ways in three places of the system.
package smelly

import (
	"fmt"
	"strconv"
)

// InvoiceLine formats an amount for the invoice.
func InvoiceLine(desc string, cents int64) string {
	return desc + ": " + fmt.Sprintf("%d.%02d EUR", cents/100, cents%100)
}

// ReceiptLine SMELL: the same problem solved with strconv and manual arithmetic.
func ReceiptLine(desc string, cents int64) string {
	frac := strconv.FormatInt(cents%100, 10)
	if len(frac) == 1 {
		frac = "0" + frac
	}
	return desc + ": " + strconv.FormatInt(cents/100, 10) + "." + frac + " EUR"
}

// EmailLine SMELL: and a third variant with float, which may also round
// differently from the other two.
func EmailLine(desc string, cents int64) string {
	return fmt.Sprintf("%s: %.2f EUR", desc, float64(cents)/100)
}
