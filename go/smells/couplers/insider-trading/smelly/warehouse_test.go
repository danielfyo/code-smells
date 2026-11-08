package smelly

import "testing"

func TestShip(t *testing.T) {
	d := &Dispatcher{}
	w := &Warehouse{Stock: map[string]int{"LAMP": 2}, Dispatcher: d}
	for i := 0; i < 2; i++ {
		if err := d.Ship(w, "LAMP"); err != nil {
			t.Fatal(err)
		}
	}
	if err := d.Ship(w, "LAMP"); err == nil {
		t.Error("expected out of stock")
	}
	if w.Stock["LAMP"] != 0 || w.Pending("LAMP") != 2 {
		t.Errorf("stock=%d pending=%d", w.Stock["LAMP"], w.Pending("LAMP"))
	}
}
