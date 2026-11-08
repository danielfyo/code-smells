package money

import "testing"

func TestFormat(t *testing.T) {
	if got := Format(1205); got != "12.05 EUR" {
		t.Fatalf("Format = %q", got)
	}
}
