package smelly

import "testing"

// Documents the consequence of value receivers: the total field is incremented
// on copies and lost (the map is shared, which is why Count does go up).
func TestValueReceiverLosesUpdates(t *testing.T) {
	pv := NewPageViews()
	pv.Hit("/home")
	pv.Hit("/home")
	if pv.Count("/home") != 2 {
		t.Fatalf("Count = %d", pv.Count("/home"))
	}
	if pv.Total() != 0 {
		t.Fatalf("Total = %d; expected 0 because Hit modifies a copy", pv.Total())
	}
}
