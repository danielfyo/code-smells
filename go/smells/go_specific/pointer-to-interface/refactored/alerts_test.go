package refactored

import "testing"

func TestAlertLowStock(t *testing.T) {
	email := &EmailNotifier{}
	AlertLowStock(email, "tea")
	if len(email.Sent) != 1 || email.Sent[0] != "low stock: tea" {
		t.Fatalf("sent = %v", email.Sent)
	}
}
