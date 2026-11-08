package smelly

import (
	"testing"
	"time"
)

func TestSessionStore(t *testing.T) {
	created := time.Date(2026, 2, 27, 8, 0, 0, 0, time.UTC)
	s := SessionStore{TTLDays: 2}
	if got, want := s.ExpiresAt(created), time.Date(2026, 3, 1, 8, 0, 0, 0, time.UTC); !got.Equal(want) {
		t.Errorf("expires = %s", got)
	}
	if s.Retries() != 3 {
		t.Errorf("retries = %d", s.Retries())
	}
	if got := (PDFRenderer{}).Render("Q1"); got != "%PDF Q1" {
		t.Errorf("render = %q", got)
	}
}
