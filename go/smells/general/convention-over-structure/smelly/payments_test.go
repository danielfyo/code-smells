package smelly

import "testing"

func TestFee(t *testing.T) {
	if Fee(Card, 10000) != 200 || Fee(Transfer, 10000) != 50 {
		t.Fatal("unexpected fee")
	}
	// Documents the bug: the convention was forgotten and PayPal charges no fee.
	if Fee(PayPal, 10000) != 0 {
		t.Fatal("expected the forgotten case to return 0")
	}
	if Label(PayPal) != "PayPal" {
		t.Fatal("unexpected label")
	}
}
