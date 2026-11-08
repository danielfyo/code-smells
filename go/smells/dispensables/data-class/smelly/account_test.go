package smelly

import "testing"

func TestTransfer(t *testing.T) {
	svc := TransferService{}
	a, b := NewBankAccount("ES01", 1000), NewBankAccount("ES02", 0)
	if err := svc.Transfer(a, b, 300); err != nil || a.Balance() != 700 || b.Balance() != 300 {
		t.Fatalf("got %v %d %d", err, a.Balance(), b.Balance())
	}
	for _, amount := range []int64{0, 5000} {
		if err := svc.Transfer(a, b, amount); err == nil {
			t.Errorf("expected error for %d", amount)
		}
	}
	b.SetFrozen(true)
	if err := svc.Transfer(a, b, 10); err == nil {
		t.Error("expected frozen error")
	}
	// SMELL documented: nothing prevents an invalid balance.
	a.SetBalance(-500)
	if a.Balance() != -500 {
		t.Error("setter should bypass rules")
	}
}
