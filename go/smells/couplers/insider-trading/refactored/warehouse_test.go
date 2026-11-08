package refactored

import (
	"errors"
	"testing"
)

func TestShip(t *testing.T) {
	w := NewWarehouse(map[string]int{"LAMP": 2})
	d := NewDispatcher(w)
	for i := 0; i < 2; i++ {
		if err := d.Ship("LAMP"); err != nil {
			t.Fatal(err)
		}
	}
	if err := d.Ship("LAMP"); !errors.Is(err, ErrOutOfStock) {
		t.Errorf("err = %v", err)
	}
	if w.Available("LAMP") != 0 || d.Pending("LAMP") != 2 {
		t.Errorf("stock=%d pending=%d", w.Available("LAMP"), d.Pending("LAMP"))
	}
}
