package refactored

import (
	"testing"
	"time"
)

func TestNewBooking(t *testing.T) {
	in := time.Date(2026, 5, 1, 14, 0, 0, 0, time.UTC)
	out := in.AddDate(0, 0, 3)
	valid := BookingRequest{
		Guest:     Guest{Name: "Ana", Email: "ana@x.io"},
		Room:      "101",
		Stay:      Stay{CheckIn: in, CheckOut: out},
		Occupancy: Occupancy{Adults: 2, Children: 1},
		Extras:    Extras{Breakfast: true},
	}
	b, err := NewBooking(valid)
	if err != nil {
		t.Fatal(err)
	}
	if b.Nights() != 3 || b.Occupancy.Adults != 2 || !b.Extras.Breakfast || b.Extras.Parking {
		t.Errorf("unexpected booking %+v", b)
	}
	badDates := valid
	badDates.Stay = Stay{CheckIn: out, CheckOut: in}
	noAdults := valid
	noAdults.Occupancy.Adults = 0
	for name, req := range map[string]BookingRequest{"dates": badDates, "adults": noAdults} {
		if _, err := NewBooking(req); err == nil {
			t.Errorf("%s: expected error", name)
		}
	}
}
