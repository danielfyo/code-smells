package refactored

import "testing"

func TestProject(t *testing.T) {
	p := NewProject("ana", 5000)
	p.SetOwner("luis")
	if p.Owner() != "luis" || p.Budget() != 5000 {
		t.Fatalf("owner=%q budget=%d", p.Owner(), p.Budget())
	}
}
