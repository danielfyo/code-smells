package refactored

import "testing"

func TestFindByID(t *testing.T) {
	var repo CustomerRepository = NewMemoryCustomerRepository(map[string]Customer{
		"c1": {Name: "Ana", Age: 30, Adult: true},
	})
	c, ok := repo.FindByID("c1")
	if !ok || c.Name != "Ana" || !c.Adult {
		t.Fatalf("got %+v, %v", c, ok)
	}
	if _, ok := repo.FindByID("zz"); ok {
		t.Fatal("unexpected customer")
	}
}
