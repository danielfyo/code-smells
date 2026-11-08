package smelly

import "testing"

func TestReserve(t *testing.T) {
	inv := NewInventory()
	inv.AddStock("tea", 3)
	if !inv.Reserve("tea", 2) || inv.Reserve("tea", 2) {
		t.Fatal("unexpected reservation result")
	}
	// The exposure lets outsiders break the invariant:
	inv.Reserved["tea"] = 99
	if inv.FreeUnits("tea") >= 0 {
		t.Fatal("expected a corrupted (negative) free count")
	}
}
