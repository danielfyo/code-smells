package refactored

import (
	"reflect"
	"testing"
)

var catalog = []Product{
	{"Green tea", []string{"tea", "organic"}},
	{"Coffee", []string{"coffee"}},
	{"Black tea", []string{"tea"}},
}

func names(ps []Product) []string {
	var out []string
	for _, p := range ps {
		out = append(out, p.Name)
	}
	return out
}

// REFACTOR: the test is linear; it compares against a literal expected
// result, so an empty list or a different order fails the assertion.
func TestByTag(t *testing.T) {
	got := names(ByTag(catalog, "tea"))
	want := []string{"Green tea", "Black tea"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("ByTag(tea) = %v, want %v", got, want)
	}
}

func TestByTagWithoutMatches(t *testing.T) {
	if got := ByTag(catalog, "juice"); len(got) != 0 {
		t.Fatalf("ByTag(juice) = %v, want empty", names(got))
	}
}
