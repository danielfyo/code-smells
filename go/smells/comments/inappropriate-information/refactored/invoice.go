// Package refactored keeps only comments that explain the code; authorship,
// dates and history are looked up in version control.
package refactored

// InvoiceTotal returns the total of an invoice in cents, VAT included.
// VAT is rounded to the nearest cent (half up), as required by the invoicing
// regulations.
//
// REFACTOR: the author/date/ticket header is gone; the comment describes the
// contract and the business rule, which is what the reader needs.
func InvoiceTotal(netCents int64, vatPercent int64) int64 {
	vat := (netCents*vatPercent + 50) / 100
	return netCents + vat
}
