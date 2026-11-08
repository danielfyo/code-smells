package refactored

import (
	"errors"
	"slices"
	"testing"
)

func TestPage(t *testing.T) {
	items := []string{"a", "b", "c", "d", "e", "f", "g"}
	tests := []struct {
		name       string
		items      []string
		page, size int
		want       []string
	}{
		{"first", items, 1, 3, []string{"a", "b", "c"}},
		{"middle", items, 2, 3, []string{"d", "e", "f"}},
		{"last partial", items, 3, 3, []string{"g"}},
		{"past the end", items, 4, 3, []string{}},
		{"page zero", items, 0, 3, []string{}},
		{"empty input", nil, 1, 3, []string{}},
	}
	for _, tt := range tests {
		got, err := Page(tt.items, tt.page, tt.size)
		if err != nil || !slices.Equal(got, tt.want) {
			t.Errorf("%s = %v, %v", tt.name, got, err)
		}
	}
	if _, err := Page(items, 1, 0); !errors.Is(err, ErrInvalidPageSize) {
		t.Errorf("size 0 err = %v", err)
	}
	for _, c := range []struct{ total, size, want int }{{7, 3, 3}, {6, 3, 2}, {0, 3, 0}, {5, 0, 0}} {
		if got := TotalPages(c.total, c.size); got != c.want {
			t.Errorf("TotalPages(%d,%d) = %d", c.total, c.size, got)
		}
	}
}
