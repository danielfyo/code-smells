package refactored

import "testing"

func TestNormalizeAndCancel(t *testing.T) {
	b := &Booking{Guest: "aNA", Nights: 2}
	NormalizeGuestName(b)
	if b.Guest != "Ana" {
		t.Fatalf("guest = %q", b.Guest)
	}
	if !Cancel(b) || Cancel(b) {
		t.Fatal("first Cancel should cancel, second should be a no-op")
	}
}
