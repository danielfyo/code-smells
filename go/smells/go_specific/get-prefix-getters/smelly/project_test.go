package smelly

import "testing"

func TestProject(t *testing.T) {
	p := NewProject("ana", 5000)
	p.SetOwner("luis")
	if p.GetOwner() != "luis" || p.GetBudget() != 5000 {
		t.Fatalf("owner=%q budget=%d", p.GetOwner(), p.GetBudget())
	}
}
