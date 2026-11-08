package smelly

import "testing"

func TestAlertLowStock(t *testing.T) {
	email := &EmailNotifier{}
	var n Notifier = email
	AlertLowStock(&n, "tea") // SMELL: &n, a pointer to the interface
	if len(email.Sent) != 1 || email.Sent[0] != "low stock: tea" {
		t.Fatalf("sent = %v", email.Sent)
	}
}
