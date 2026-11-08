package smelly

import "testing"

func TestNotifyShipment(t *testing.T) {
	email, sms := &EmailSender{}, &SMSGateway{}
	if err := NotifyShipment(email, sms, "ana@x.io", "600111222", "A-1"); err != nil {
		t.Fatal(err)
	}
	if email.Outbox[0] != "email:ana@x.io:Shipment:Order A-1 shipped" || sms.Sent[0] != "sms:600111222:Order A-1 shipped" {
		t.Errorf("got %v %v", email.Outbox, sms.Sent)
	}
	if err := NotifyShipment(email, sms, "ana@x.io", "", "A-2"); err == nil {
		t.Error("expected sms error")
	}
	if err := NotifyShipment(email, sms, "", "600", "A-3"); err == nil {
		t.Error("expected email error")
	}
}
