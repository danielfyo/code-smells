package smelly

import "testing"

func TestFindByID(t *testing.T) {
	var repo ICustomerRepository = MapCustomerRepository{MCustomers: map[string]StructCustomer{
		"c1": {StrName: "Ana", IntAge: 30, BIsAdult: true},
	}}
	c, ok := repo.FindByID("c1")
	if !ok || c.StrName != "Ana" || !c.BIsAdult {
		t.Fatalf("got %+v, %v", c, ok)
	}
	if _, ok := repo.FindByID("zz"); ok {
		t.Fatal("unexpected customer")
	}
}
