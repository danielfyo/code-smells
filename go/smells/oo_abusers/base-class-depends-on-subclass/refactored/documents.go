// Package refactored fixes Base Class Depending on Its Derivatives by
// inverting the dependency: the shared part only knows a small interface
// (Body) that each document implements; the base does not know which
// concrete types exist.
package refactored

import "fmt"

// Exportable is all the shared logic needs.
// REFACTOR: Dependency Inversion + Template Method through an interface.
type Exportable interface {
	ID() string
	Body() string
}

// Export combines the shared part with the specific part.
func Export(e Exportable) string { return "#" + e.ID() + " " + e.Body() }

// Document holds only the shared data; it references nobody.
type Document struct{ Number string }

// ID returns the document number.
func (d Document) ID() string { return d.Number }

// Invoice is an invoice.
type Invoice struct {
	Document
	Total float64
}

// NewInvoice creates an invoice.
func NewInvoice(number string, total float64) Invoice {
	return Invoice{Document{number}, total}
}

// Body is the invoice-specific part.
func (i Invoice) Body() string { return fmt.Sprintf("INVOICE total=%.2f", i.Total) }

// Receipt is a receipt.
type Receipt struct {
	Document
	PaidBy string
}

// NewReceipt creates a receipt.
func NewReceipt(number, paidBy string) Receipt { return Receipt{Document{number}, paidBy} }

// Body is the receipt-specific part.
func (r Receipt) Body() string { return "RECEIPT paid by " + r.PaidBy }
