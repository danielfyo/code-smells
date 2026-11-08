package smelly

import "testing"

func TestProcessAndHandle(t *testing.T) {
	b := &Booking{Guest: "aNA", Nights: 2}
	Process(b)
	if b.Guest != "Ana" {
		t.Fatalf("guest = %q", b.Guest)
	}
	if !Handle(b) || Handle(b) {
		t.Fatal("first Handle should cancel, second should be a no-op")
	}
}
