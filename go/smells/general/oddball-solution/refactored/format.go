// Package refactored unifies the solution: a single FormatEUR used by every
// channel.
package refactored

import "fmt"

// FormatEUR formats cents as "12.05 EUR".
//
// REFACTOR: Substitute Algorithm + Extract Function; one way to solve the
// problem, one place to change.
func FormatEUR(cents int64) string {
	return fmt.Sprintf("%d.%02d EUR", cents/100, cents%100)
}

func line(desc string, cents int64) string { return desc + ": " + FormatEUR(cents) }

// InvoiceLine formats an amount for the invoice.
func InvoiceLine(desc string, cents int64) string { return line(desc, cents) }

// ReceiptLine formats an amount for the receipt.
func ReceiptLine(desc string, cents int64) string { return line(desc, cents) }

// EmailLine formats an amount for the email.
func EmailLine(desc string, cents int64) string { return line(desc, cents) }
