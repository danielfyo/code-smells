package smelly

import (
	"testing"
	"time"
)

func TestOk(t *testing.T) {
	c := time.Date(2026, 1, 1, 10, 0, 0, 0, time.UTC)
	tests := []struct {
		name string
		tok  T
		now  time.Time
		want bool
	}{
		{"fresh", T{C: c}, c.Add(10 * time.Minute), true},
		{"limit", T{C: c}, c.Add(30 * time.Minute), true},
		{"expired", T{C: c}, c.Add(31 * time.Minute), false},
		{"used", T{C: c, U: 1}, c, false},
		{"revoked", T{C: c, R: true}, c, false},
	}
	for _, tt := range tests {
		if got := Ok(tt.tok, tt.now); got != tt.want {
			t.Errorf("%s = %v", tt.name, got)
		}
	}
}
