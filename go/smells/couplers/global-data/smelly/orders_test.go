package smelly

import "testing"

func TestPlaceOrder(t *testing.T) {
	Reset()
	defer Reset() // SMELL documented: without this, other tests inherit the state.
	if id, total := PlaceOrder(100); id != "ORD-001" || total != 100 {
		t.Errorf("got %s %v", id, total)
	}
	StartSale()
	if id, total := PlaceOrder(100); id != "ORD-002" || total != 80 {
		t.Errorf("got %s %v", id, total)
	}
}

func TestGlobalStateLeaks(t *testing.T) {
	Reset()
	defer Reset()
	StartSale() // "another module" enables the sale...
	if _, total := PlaceOrder(50); total != 40 {
		t.Errorf("total = %v; the global rate leaked to every caller", total)
	}
}
