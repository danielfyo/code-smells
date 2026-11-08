package smelly

import "testing"

func TestFloatMoneyIsImprecise(t *testing.T) {
	var w Wallet
	for i := 0; i < 10; i++ {
		w.Deposit(0.10)
	}
	// Documents the bug: ten deposits of 0.10 do not add up to exactly 1.00.
	if w.Balance == 1.00 {
		t.Fatal("expected floating point drift")
	}
}

func TestFindByEmailHidesMissing(t *testing.T) {
	if u := FindByEmail(nil, "x@shop.test"); u.Email != "" {
		t.Fatal("expected zero value")
	}
}
