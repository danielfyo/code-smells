package refactored

import "testing"

func TestConfirmationEmail(t *testing.T) {
	o := Order{ID: "A1", Lines: []Line{{5000, 2}, {2000, 1}}}
	if o.Total() != 11400 {
		t.Fatalf("Total = %d", o.Total())
	}
	if got := ConfirmationEmail(o); got != "Order A1 confirmed. Total: 11400 cents" {
		t.Fatalf("got %q", got)
	}
}
