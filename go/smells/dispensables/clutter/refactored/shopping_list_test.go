package refactored

import "testing"

func TestShoppingList(t *testing.T) {
	var l ShoppingList
	for _, i := range []string{" Milk", "", "bread ", "   ", "Apples"} {
		l.Add(i)
	}
	if got := l.Summary(); got != "apples, bread, milk" {
		t.Errorf("got %q", got)
	}
	if got := (&ShoppingList{}).Summary(); got != "" {
		t.Errorf("empty = %q", got)
	}
}
