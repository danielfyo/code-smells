package smelly

import "testing"

func TestExport(t *testing.T) {
	if got := NewInvoice("F-1", 121.5).Export(); got != "#F-1 INVOICE total=121.50" {
		t.Errorf("invoice = %q", got)
	}
	if got := NewReceipt("R-7", "card").Export(); got != "#R-7 RECEIPT paid by card" {
		t.Errorf("receipt = %q", got)
	}
	// SMELL documented: if built without the constructor, self stays nil.
	raw := &Invoice{Document: Document{Number: "F-2"}, Total: 1}
	if got := raw.Export(); got != "#F-2 UNKNOWN" {
		t.Errorf("raw = %q", got)
	}
}
