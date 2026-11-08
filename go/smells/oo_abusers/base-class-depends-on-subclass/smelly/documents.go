// Package smelly illustrates Base Class Depending on Its Derivatives adapted
// to Go: the "base" type Document, embedded in Invoice and Receipt, keeps a
// reference to its "subclass" and type-switches on it. The base knows all
// of its derivatives: adding a new one forces a change to it.
package smelly

import "fmt"

// Document is the embedded "base class".
type Document struct {
	Number string
	self   any // SMELL: pointer to the derivative so it can be asked what it is.
}

// Export renders any document.
// SMELL: the base depends on its concrete derivatives (breaks open/closed
// and creates a conceptual circular dependency).
func (d *Document) Export() string {
	header := "#" + d.Number
	switch x := d.self.(type) {
	case *Invoice:
		return fmt.Sprintf("%s INVOICE total=%.2f", header, x.Total)
	case *Receipt:
		return fmt.Sprintf("%s RECEIPT paid by %s", header, x.PaidBy)
	default:
		return header + " UNKNOWN"
	}
}

// Invoice is an invoice.
type Invoice struct {
	Document
	Total float64
}

// NewInvoice must remember to wire self.
func NewInvoice(number string, total float64) *Invoice {
	inv := &Invoice{Document: Document{Number: number}, Total: total}
	inv.self = inv
	return inv
}

// Receipt is a receipt.
type Receipt struct {
	Document
	PaidBy string
}

// NewReceipt must remember to wire self.
func NewReceipt(number, paidBy string) *Receipt {
	r := &Receipt{Document: Document{Number: number}, PaidBy: paidBy}
	r.self = r
	return r
}
