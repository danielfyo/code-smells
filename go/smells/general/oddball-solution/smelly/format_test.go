package smelly

import "testing"

func TestLinesAgree(t *testing.T) {
	want := "Tea: 12.05 EUR"
	for name, got := range map[string]string{
		"invoice": InvoiceLine("Tea", 1205),
		"receipt": ReceiptLine("Tea", 1205),
		"email":   EmailLine("Tea", 1205),
	} {
		if got != want {
			t.Errorf("%s = %q, want %q", name, got, want)
		}
	}
}
