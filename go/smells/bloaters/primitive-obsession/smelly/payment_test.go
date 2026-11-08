package smelly

import "testing"

func TestTotal(t *testing.T) {
	a, err := NewPayment("Ana@Shop.io", 1050, "eur")
	if err != nil {
		t.Fatal(err)
	}
	b, _ := NewPayment("bob@shop.io", 250, "EUR")
	c, _ := NewPayment("bob@shop.io", 100, "USD")
	if a.Email != "ana@shop.io" {
		t.Errorf("email = %q", a.Email)
	}
	if got, _ := Total([]Payment{a, b}); got != "13.00 EUR" {
		t.Errorf("total = %q", got)
	}
	if got, _ := Total(nil); got != "0.00" {
		t.Errorf("empty total = %q", got)
	}
	if _, err := Total([]Payment{a, c}); err == nil {
		t.Error("expected currency mismatch")
	}
	for _, bad := range []struct {
		e   string
		c   int64
		cur string
	}{{"no-at", 1, "EUR"}, {"a@b", -1, "EUR"}, {"a@b", 1, "EU"}} {
		if _, err := NewPayment(bad.e, bad.c, bad.cur); err == nil {
			t.Errorf("expected error for %+v", bad)
		}
	}
}
