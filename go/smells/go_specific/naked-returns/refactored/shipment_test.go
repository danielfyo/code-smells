package refactored

import "testing"

func TestQuote(t *testing.T) {
	cases := []struct {
		country string
		kg      int
		express bool
		cost    int64
		days    int
		wantErr bool
	}{
		{"es", 1, false, 400, 2, false},
		{"FR", 7, false, 1100, 4, false},
		{"DE", 7, true, 2200, 2, false},
		{"ES", 25, false, 2400, 3, false},
		{"US", 1, false, 0, 0, true},
		{"ES", 0, false, 0, 0, true},
	}
	for _, c := range cases {
		cost, days, err := Quote(c.country, c.kg, c.express)
		if (err != nil) != c.wantErr || cost != c.cost || days != c.days {
			t.Errorf("Quote(%q, %d, %v) = %d, %d, %v", c.country, c.kg, c.express, cost, days, err)
		}
	}
}
