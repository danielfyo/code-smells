package smelly

import "testing"

func TestSendSMTPEmailToCustomer(t *testing.T) {
	m := &SMTPMailer{}
	m.SendSMTPEmailToCustomer("ana", "42")
	if ShippedOrderIDsSlice(m) != 1 || m.Outbox[0] != "ana: order 42 shipped" {
		t.Fatalf("outbox = %v", m.Outbox)
	}
}
