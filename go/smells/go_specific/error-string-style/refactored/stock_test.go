package refactored

import (
	"errors"
	"testing"
)

func TestReserveMessages(t *testing.T) {
	stock := map[string]int{"tea": 1}
	err := Reserve(stock, "tea", 5)
	if !errors.Is(err, ErrNoStock) || err.Error() != "reserve tea: not enough stock (have 1, want 5)" {
		t.Fatalf("err = %v", err)
	}
	err = Reserve(stock, "milk", 1)
	if !errors.Is(err, ErrNotFound) || err.Error() != "reserve milk: product not found" {
		t.Fatalf("err = %v", err)
	}
}
