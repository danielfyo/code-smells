// Package smelly shows comments holding information that belongs to version
// control or the issue tracker (author, dates, history, tickets).
package smelly

// SMELL: header with author, date and change history. That information
// already lives in git (git log / git blame) and here it just goes stale.
//
// Author: jperez
// Created: 03/02/2019
// Modified: 14/07/2021 - mlopez - JIRA-4521 change VAT
// Modified: 02/01/2023 - jperez - JIRA-7788 rounding

// InvoiceTotal computes the total of an invoice with VAT.
// SMELL: points to a ticket and a person instead of explaining the why.
// See JIRA-4521, ask Marta before touching this.
func InvoiceTotal(netCents int64, vatPercent int64) int64 {
	// SMELL: a "changelog" comment inside the code.
	// 14/07/2021 mlopez: it used to be netCents * 116 / 100
	vat := (netCents*vatPercent + 50) / 100
	return netCents + vat
}
