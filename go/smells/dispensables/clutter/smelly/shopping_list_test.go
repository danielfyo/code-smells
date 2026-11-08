package smelly

import "testing"

func TestShoppingList(t *testing.T) {
	l := NewShoppingList()
	for _, i := range []string{" Milk", "", "bread ", "   ", "Apples"} {
		l.Add(i)
	}
	if got := l.Summary(); got != "apples, bread, milk" {
		t.Errorf("got %q", got)
	}
}
