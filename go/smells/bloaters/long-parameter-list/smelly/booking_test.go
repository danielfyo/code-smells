package smelly

import (
	"testing"
	"time"
)

func TestNewBooking(t *testing.T) {
	in := time.Date(2026, 5, 1, 14, 0, 0, 0, time.UTC)
	out := in.AddDate(0, 0, 3)
	// SMELL: which one is adults and which one children? You must check the signature.
	b, err := NewBooking("Ana", "ana@x.io", "101", in, out, 2, 1, true, false)
	if err != nil {
		t.Fatal(err)
	}
	if b.Nights() != 3 || b.Adults != 2 || !b.Breakfast || b.Parking {
		t.Errorf("unexpected booking %+v", b)
	}
	if _, err := NewBooking("Ana", "ana@x.io", "101", out, in, 2, 1, true, false); err == nil {
		t.Error("expected date error")
	}
	if _, err := NewBooking("Ana", "ana@x.io", "101", in, out, 0, 1, true, false); err == nil {
		t.Error("expected adults error")
	}
}
