package refactored

import "testing"

func TestNotifyShipment(t *testing.T) {
	email, sms := &EmailNotifier{Address: "ana@x.io"}, &SMSNotifier{Phone: "600111222"}
	if err := NotifyShipment("A-1", email, sms); err != nil {
		t.Fatal(err)
	}
	if email.Outbox[0] != "email:ana@x.io:Shipment:Order A-1 shipped" || sms.Sent[0] != "sms:600111222:Order A-1 shipped" {
		t.Errorf("got %v %v", email.Outbox, sms.Sent)
	}
	if err := NotifyShipment("A-2", email, &SMSNotifier{}); err == nil {
		t.Error("expected sms error")
	}
	if err := NotifyShipment("A-3", &EmailNotifier{}, sms); err == nil {
		t.Error("expected email error")
	}
}
