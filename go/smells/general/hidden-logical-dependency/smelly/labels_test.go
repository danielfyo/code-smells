package smelly

import "testing"

func TestFormatLabel(t *testing.T) {
	p := &LabelPrinter{}
	p.Print(FormatLabel("Calle Mayor 1, Zaragoza"))
	p.Print(FormatLabel("Gran Via 2"))
	if p.Printed[0] != "Calle Mayor 1, Zarag" || p.Printed[1] != "Gran Via 2          " {
		t.Fatalf("printed = %q", p.Printed)
	}
}
