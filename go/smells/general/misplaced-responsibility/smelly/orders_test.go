package smelly

import "testing"

func TestConfirmationEmail(t *testing.T) {
	o := Order{ID: "A1", Lines: []Line{{5000, 2}, {2000, 1}}}
	if got := ConfirmationEmail(o); got != "Order A1 confirmed. Total: 11400 cents" {
		t.Fatalf("got %q", got)
	}
}
