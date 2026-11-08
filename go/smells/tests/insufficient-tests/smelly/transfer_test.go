package smelly

import "testing"

// SMELL: a single happy-path test. None of the three errors is tested and
// coverage is not measured (go test -cover would say ~50 %). If someone
// deletes the balance check, this test stays green.
func TestTransfer(t *testing.T) {
	a := &Account{ID: "a", Balance: 1000}
	b := &Account{ID: "b"}
	if err := Transfer(a, b, 300); err != nil {
		t.Fatal(err)
	}
	if a.Balance != 700 || b.Balance != 300 {
		t.Fatalf("balances = %d, %d", a.Balance, b.Balance)
	}
}
