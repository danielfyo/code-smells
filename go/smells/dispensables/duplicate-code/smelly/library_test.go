package smelly

import (
	"testing"
	"time"
)

func TestLateFees(t *testing.T) {
	due := time.Date(2026, 3, 1, 12, 0, 0, 0, time.UTC)
	tests := []struct {
		name      string
		returned  time.Time
		book, dvd float64
	}{
		{"on time", due, 0, 0},
		{"early", due.Add(-time.Hour), 0, 0},
		{"few hours late", due.Add(3 * time.Hour), 0.25, 1},
		{"4 days", due.AddDate(0, 0, 4), 1, 4},
		{"capped", due.AddDate(0, 0, 60), 10, 20},
	}
	for _, tt := range tests {
		if got := BookLateFee(due, tt.returned); got != tt.book {
			t.Errorf("%s book = %v, want %v", tt.name, got, tt.book)
		}
		if got := DVDLateFee(due, tt.returned); got != tt.dvd {
			t.Errorf("%s dvd = %v, want %v", tt.name, got, tt.dvd)
		}
	}
}
