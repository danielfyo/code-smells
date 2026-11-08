package smelly

import "testing"

func TestInvoiceTotal(t *testing.T) {
	repo := NewOrderRepository()
	repo.Save("a", 1000)
	repo.Save("b", 250)
	if got := InvoiceTotal(repo, []string{"a", "b", "zz"}); got != 1250 {
		t.Fatalf("InvoiceTotal = %d", got)
	}
}
