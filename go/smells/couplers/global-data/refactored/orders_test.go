package refactored

import "testing"

func TestPlaceOrder(t *testing.T) {
	var s Shop
	if id, total := s.PlaceOrder(100); id != "ORD-001" || total != 100 {
		t.Errorf("got %s %v", id, total)
	}
	s.StartSale()
	if id, total := s.PlaceOrder(100); id != "ORD-002" || total != 80 {
		t.Errorf("got %s %v", id, total)
	}
}

func TestShopsAreIndependent(t *testing.T) {
	var outlet, store Shop
	outlet.StartSale()
	if _, total := store.PlaceOrder(50); total != 50 {
		t.Errorf("total = %v", total)
	}
}
