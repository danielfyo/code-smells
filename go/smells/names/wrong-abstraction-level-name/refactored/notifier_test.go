package refactored

import "testing"

func TestNotifyShipped(t *testing.T) {
	n := &EmailNotifier{}
	var notifier ShipmentNotifier = n
	notifier.NotifyShipped("ana", "42")
	if n.SentCount() != 1 || n.Outbox[0] != "ana: order 42 shipped" {
		t.Fatalf("outbox = %v", n.Outbox)
	}
}
