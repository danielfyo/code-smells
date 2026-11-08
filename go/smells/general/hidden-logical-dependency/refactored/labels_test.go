package refactored

import "testing"

func TestPrintAddress(t *testing.T) {
	p := NewLabelPrinter(20)
	p.PrintAddress("Calle Mayor 1, Zaragoza")
	p.PrintAddress("Gran Via 2")
	if p.Printed[0] != "Calle Mayor 1, Zarag" || p.Printed[1] != "Gran Via 2          " {
		t.Fatalf("printed = %q", p.Printed)
	}
	if got := NewLabelPrinter(5); FormatLabel("abcdefg", got.Width()) != "abcde" {
		t.Fatal("width not honoured")
	}
}
