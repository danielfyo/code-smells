package refactored

import "testing"

type fakeFinder map[string]int64

func (f fakeFinder) Find(id string) (int64, bool) { c, ok := f[id]; return c, ok }

func TestInvoiceTotal(t *testing.T) {
	repo := NewOrderRepository()
	repo.Save("a", 1000)
	repo.Save("b", 250)
	if got := InvoiceTotal(repo, []string{"a", "b", "zz"}); got != 1250 {
		t.Fatalf("InvoiceTotal = %d", got)
	}
	// A trivial test double: implementing one method is enough.
	if got := InvoiceTotal(fakeFinder{"x": 5}, []string{"x"}); got != 5 {
		t.Fatalf("InvoiceTotal(fake) = %d", got)
	}
}
