package refactored

import "testing"

func TestCustomerStore(t *testing.T) {
	s := NewCustomerStore(Customer{"c1", "ana@shop.test"}, Customer{"c2", "luis@shop.test"})
	if c, ok := s.FindCustomer("c1"); !ok || c.Email != "ana@shop.test" {
		t.Fatalf("FindCustomer = %+v, %v", c, ok)
	}
	if got := s.FindCustomerEmail("c2"); got != "luis@shop.test" {
		t.Fatalf("FindCustomerEmail = %q", got)
	}
	if s.CustomerCount() != 2 {
		t.Fatal("CustomerCount != 2")
	}
}
