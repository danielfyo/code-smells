package refactored

import "testing"

func TestExport(t *testing.T) {
	tests := []struct {
		doc  Exportable
		want string
	}{
		{NewInvoice("F-1", 121.5), "#F-1 INVOICE total=121.50"},
		{NewReceipt("R-7", "card"), "#R-7 RECEIPT paid by card"},
		{Invoice{Document{"F-2"}, 1}, "#F-2 INVOICE total=1.00"},
	}
	for _, tt := range tests {
		if got := Export(tt.doc); got != tt.want {
			t.Errorf("got %q, want %q", got, tt.want)
		}
	}
}
