package refactored

import (
	"testing"
	"time"
)

func TestIsValid(t *testing.T) {
	c := time.Date(2026, 1, 1, 10, 0, 0, 0, time.UTC)
	tests := []struct {
		name string
		tok  ResetToken
		now  time.Time
		want bool
	}{
		{"fresh", ResetToken{CreatedAt: c}, c.Add(10 * time.Minute), true},
		{"limit", ResetToken{CreatedAt: c}, c.Add(30 * time.Minute), true},
		{"expired", ResetToken{CreatedAt: c}, c.Add(31 * time.Minute), false},
		{"used", ResetToken{CreatedAt: c, Uses: 1}, c, false},
		{"revoked", ResetToken{CreatedAt: c, Revoked: true}, c, false},
	}
	for _, tt := range tests {
		if got := tt.tok.IsValid(tt.now); got != tt.want {
			t.Errorf("%s = %v", tt.name, got)
		}
	}
}
