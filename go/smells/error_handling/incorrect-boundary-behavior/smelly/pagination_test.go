package smelly

import (
	"slices"
	"testing"
)

var items = []string{"a", "b", "c", "d", "e", "f", "g"}

func TestMiddlePage(t *testing.T) {
	if got := Page(items, 2, 3); !slices.Equal(got, []string{"d", "e", "f"}) {
		t.Errorf("page 2 = %v", got)
	}
}

// Documents the boundary bugs.
func TestBoundaryBugs(t *testing.T) {
	if got := TotalPages(len(items), 3); got != 2 {
		t.Errorf("TotalPages = %d; smelly version loses the partial page (2)", got)
	}
	defer func() {
		if recover() == nil {
			t.Error("expected panic on the last partial page")
		}
	}()
	Page(items, 3, 3)
}
