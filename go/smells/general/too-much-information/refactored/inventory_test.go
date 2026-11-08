package refactored

import "testing"

func TestReserve(t *testing.T) {
	inv := NewInventory()
	inv.AddStock("tea", 3)
	if !inv.Reserve("tea", 2) || inv.Reserve("tea", 2) {
		t.Fatal("unexpected reservation result")
	}
	if got := inv.Available("tea"); got != 1 {
		t.Fatalf("Available = %d, want 1", got)
	}
}
