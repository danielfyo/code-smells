package refactored

import "testing"

func TestInvoiceTotal(t *testing.T) {
	if got := InvoiceTotal(10000, 21); got != 12100 {
		t.Fatalf("InvoiceTotal(10000, 21) = %d, want 12100", got)
	}
	if got := InvoiceTotal(999, 21); got != 1209 {
		t.Fatalf("InvoiceTotal(999, 21) = %d, want 1209", got)
	}
}
