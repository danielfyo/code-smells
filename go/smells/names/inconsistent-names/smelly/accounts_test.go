package smelly

import "testing"

func TestStore(t *testing.T) {
	s := NewStore(Customer{"c1", "ana@shop.test"}, Customer{"c2", "luis@shop.test"})
	if c, ok := s.FetchUser("c1"); !ok || c.Email != "ana@shop.test" {
		t.Fatalf("FetchUser = %+v, %v", c, ok)
	}
	if got := s.GetClientEmail("c2"); got != "luis@shop.test" {
		t.Fatalf("GetClientEmail = %q", got)
	}
	if s.RetrieveCustomerCount() != 2 {
		t.Fatal("RetrieveCustomerCount != 2")
	}
}
