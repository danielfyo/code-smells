package smelly

import (
	"fmt"
	"testing"
)

func TestMoneyText(t *testing.T) {
	m := MoneyMaker{Currency: "EUR"}.Make(1250)
	if got := m.ToText(); got != "12.50 EUR" {
		t.Fatalf("ToText = %q", got)
	}
	// SMELL demonstrated: fmt does not know ToText, so it prints the raw struct.
	if got := fmt.Sprint(m); got != "{1250 EUR}" {
		t.Fatalf("fmt.Sprint = %q", got)
	}
}
