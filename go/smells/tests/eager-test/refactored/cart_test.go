package refactored

import (
	"errors"
	"testing"
)

// REFACTOR: one test per behavior, each with its minimal setup and a name
// that works as a specification.

func newTestCart() *Cart { return NewCart(map[string]int64{"tea": 250, "milk": 99}) }

func TestCountSumsUnitsOfAllItems(t *testing.T) {
	c := newTestCart()
	c.Add("tea", 2)
	c.Add("milk", 1)
	if got := c.Count(); got != 3 {
		t.Fatalf("Count() = %d, want 3", got)
	}
}

func TestTotalMultipliesPriceByQuantity(t *testing.T) {
	c := newTestCart()
	c.Add("tea", 2)
	c.Add("milk", 1)
	if got := c.Total(); got != 599 {
		t.Fatalf("Total() = %d, want 599", got)
	}
}

func TestRemoveDropsTheWholeItem(t *testing.T) {
	c := newTestCart()
	c.Add("tea", 2)
	c.Add("milk", 1)
	if err := c.Remove("tea"); err != nil {
		t.Fatal(err)
	}
	if c.Count() != 1 || c.Total() != 99 {
		t.Fatalf("count=%d total=%d, want 1 and 99", c.Count(), c.Total())
	}
}

func TestRemoveUnknownItemFails(t *testing.T) {
	if err := newTestCart().Remove("tea"); !errors.Is(err, ErrUnknownItem) {
		t.Fatalf("err = %v, want ErrUnknownItem", err)
	}
}
