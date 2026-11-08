package refactored

import (
	"errors"
	"testing"
)

func TestIntegerMoneyIsExact(t *testing.T) {
	var w Wallet
	for i := 0; i < 10; i++ {
		w.Deposit(10)
	}
	if w.BalanceCents != 100 {
		t.Fatalf("balance = %d", w.BalanceCents)
	}
}

func TestFindByEmail(t *testing.T) {
	users := []User{{"a@shop.test", "Ana"}, {"d@shop.test", "D1"}, {"d@shop.test", "D2"}}
	if u, err := FindByEmail(users, "a@shop.test"); err != nil || u.Name != "Ana" {
		t.Fatalf("got %+v, %v", u, err)
	}
	if _, err := FindByEmail(users, "x@shop.test"); !errors.Is(err, ErrNotFound) {
		t.Fatalf("err = %v", err)
	}
	if _, err := FindByEmail(users, "d@shop.test"); !errors.Is(err, ErrAmbiguous) {
		t.Fatalf("err = %v", err)
	}
}
