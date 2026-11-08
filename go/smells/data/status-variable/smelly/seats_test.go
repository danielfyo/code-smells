package smelly

import "testing"

func TestFirstFreePair(t *testing.T) {
	const x, o = true, false
	tests := []struct {
		name      string
		rows      [][]bool
		row, seat int
		ok        bool
	}{
		{"second row", [][]bool{{x, o, x, o}, {x, x, o, o}}, 1, 2, true},
		{"first row", [][]bool{{o, o}, {o, o}}, 0, 0, true},
		{"full", [][]bool{{x, o, x}, {o, x, o}}, -1, -1, false},
		{"empty", nil, -1, -1, false},
	}
	for _, tt := range tests {
		r, s, ok := FirstFreePair(tt.rows)
		if r != tt.row || s != tt.seat || ok != tt.ok {
			t.Errorf("%s = %d,%d,%v", tt.name, r, s, ok)
		}
	}
}
