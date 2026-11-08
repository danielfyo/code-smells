package refactored_test

import (
	"testing"

	"github.com/danielfyo/code-smells/go/smells/tests/fragile-test/refactored"
)

// REFACTOR: the test lives in the external package refactored_test, so it can
// only use the public API. It checks observable behavior (prices), not how
// they are computed; any internal refactoring keeps it green.
func TestPrice(t *testing.T) {
	p := refactored.NewPriceList(map[string]int64{"tea": 250})
	cases := []struct {
		qty  int
		want int64
	}{
		{2, 500},
		{2, 500}, // repeating the query (with or without cache) gives the same
		{9, 2250},
		{10, 2250}, // 10 % discount from 10 units upwards
	}
	for _, c := range cases {
		if got := p.Price("tea", c.qty); got != c.want {
			t.Errorf("Price(tea, %d) = %d, want %d", c.qty, got, c.want)
		}
	}
}
