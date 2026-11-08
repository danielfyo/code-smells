package smelly

import "testing"

func TestPrice(t *testing.T) {
	d := NewDirectory(&Customer{ID: "gold", Membership: &Membership{DiscountPct: 20}}, &Customer{ID: "basic"})
	for id, want := range map[string]float64{"gold": 80, "basic": 100, "ghost": 100} {
		if got := d.Price(id, 100); got != want {
			t.Errorf("%s = %v", id, got)
		}
	}
	if d.MemberDiscount("gold") != 20 {
		t.Error("gold discount")
	}
}

// Documents the bug: a forgotten nil check panics.
func TestMemberDiscountPanics(t *testing.T) {
	defer func() {
		if recover() == nil {
			t.Error("expected nil pointer panic")
		}
	}()
	NewDirectory(&Customer{ID: "basic"}).MemberDiscount("basic")
}
