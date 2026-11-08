package refactored

import "testing"

// REFACTOR: the test has been re-enabled (and fixed). If it really had to be
// skipped, it would be with an explicit, temporary reason, e.g.
// t.Skip("depends on the 2027 VAT table, see issue #123; re-enable when published").
func TestVATPercent(t *testing.T) {
	cases := map[string]int{"electronics": 21, "food": 10, "books": 4, "medicine": 4}
	for category, want := range cases {
		if got := VATPercent(category); got != want {
			t.Errorf("VATPercent(%q) = %d, want %d", category, got, want)
		}
	}
}
