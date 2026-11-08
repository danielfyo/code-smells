package refactored

import (
	"errors"
	"testing"
)

// REFACTOR: Fresh Fixture. Each test creates its own library and prepares its
// own state; tests are independent and can run in any order and in
// parallel.

func TestLend(t *testing.T) {
	t.Parallel()
	lib := NewLibrary()
	if err := lib.Lend("Dune", "ana"); err != nil {
		t.Fatal(err)
	}
	if lib.LentCount() != 1 {
		t.Fatalf("lent = %d, want 1", lib.LentCount())
	}
}

func TestLendTwiceFails(t *testing.T) {
	t.Parallel()
	lib := NewLibrary()
	_ = lib.Lend("Dune", "ana") // explicit setup
	if err := lib.Lend("Dune", "luis"); !errors.Is(err, ErrAlreadyLent) {
		t.Fatalf("err = %v, want ErrAlreadyLent", err)
	}
}

func TestReturn(t *testing.T) {
	t.Parallel()
	lib := NewLibrary()
	_ = lib.Lend("Dune", "ana")
	lib.Return("Dune")
	if lib.LentCount() != 0 {
		t.Fatalf("lent = %d, want 0", lib.LentCount())
	}
}
