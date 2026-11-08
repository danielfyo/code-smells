package refactored

import (
	"fmt"
	"testing"
)

func TestMoneyString(t *testing.T) {
	m := MoneyFactory{Currency: "EUR"}.New(1250)
	if got := m.String(); got != "12.50 EUR" {
		t.Fatalf("String = %q", got)
	}
	if got := fmt.Sprint(m); got != "12.50 EUR" {
		t.Fatalf("fmt.Sprint = %q", got)
	}
}
