package smelly

import "testing"

// SMELL: shared, mutable package-level fixture. Each test depends on what the
// previous one left behind: they pass only in file order. With
// `go test -shuffle=on`, `-run TestReturn` or t.Parallel() they fail.
var lib = NewLibrary()

func TestLend(t *testing.T) {
	if err := lib.Lend("Dune", "ana"); err != nil {
		t.Fatal(err)
	}
}

func TestLendTwiceFails(t *testing.T) {
	// Depends on TestLend having run before.
	if err := lib.Lend("Dune", "luis"); err == nil {
		t.Fatal("expected ErrAlreadyLent")
	}
}

func TestReturn(t *testing.T) {
	// Depends on the two previous tests so that there is exactly one loan.
	lib.Return("Dune")
	if lib.LentCount() != 0 {
		t.Fatalf("lent = %d", lib.LentCount())
	}
}
