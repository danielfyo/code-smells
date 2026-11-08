package smelly

import "testing"

var catalog = []Product{
	{"Green tea", []string{"tea", "organic"}},
	{"Coffee", []string{"coffee"}},
	{"Black tea", []string{"tea"}},
}

// SMELL: conditional logic in the test. If ByTag returned an empty slice the
// loop would not run and the test would pass without checking anything. The
// if/else also duplicates production logic inside the test.
func TestByTag(t *testing.T) {
	result := ByTag(catalog, "tea")
	for _, p := range result {
		found := false
		for _, tag := range p.Tags {
			if tag == "tea" {
				found = true
			}
		}
		if !found {
			t.Errorf("%s has no tea tag", p.Name)
		}
	}
	if len(result) > 0 {
		if result[0].Name != "Green tea" {
			t.Error("unexpected first result")
		}
	}
}
