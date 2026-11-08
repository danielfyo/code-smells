package refactored

import (
	"errors"
	"testing"
)

func mustMoney(t *testing.T, c int64, cur string) Money {
	t.Helper()
	m, err := NewMoney(c, cur)
	if err != nil {
		t.Fatal(err)
	}
	return m
}

func TestTotal(t *testing.T) {
	email, err := ParseEmail("Ana@Shop.io")
	if err != nil || email != "ana@shop.io" {
		t.Fatalf("email = %q, %v", email, err)
	}
	a := Payment{email, mustMoney(t, 1050, "eur")}
	b := Payment{email, mustMoney(t, 250, "EUR")}
	c := Payment{email, mustMoney(t, 100, "USD")}
	if got, _ := Total([]Payment{a, b}); got != "13.00 EUR" {
		t.Errorf("total = %q", got)
	}
	if got, _ := Total(nil); got != "0.00" {
		t.Errorf("empty total = %q", got)
	}
	if _, err := Total([]Payment{a, c}); !errors.Is(err, ErrCurrencyMismatch) {
		t.Errorf("err = %v", err)
	}
	if _, err := ParseEmail("no-at"); err == nil {
		t.Error("expected email error")
	}
	if _, err := NewMoney(-1, "EUR"); err == nil {
		t.Error("expected amount error")
	}
	if _, err := NewMoney(1, "EU"); err == nil {
		t.Error("expected currency error")
	}
}
