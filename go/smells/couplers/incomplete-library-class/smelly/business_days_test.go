package smelly

import (
	"testing"
	"time"
)

func day(d int) time.Time { return time.Date(2026, 3, d, 9, 0, 0, 0, time.UTC) }

func TestBusinessDates(t *testing.T) {
	// 2026-03-06 is a Friday.
	tests := []struct {
		name string
		got  time.Time
		want time.Time
	}{
		{"invoice from friday", InvoiceDueDate(day(6)), day(20)},
		{"delivery from friday", DeliveryEstimate(day(6)), day(11)},
		{"delivery from monday", DeliveryEstimate(day(9)), day(12)},
		{"delivery from saturday", DeliveryEstimate(day(7)), day(11)},
	}
	for _, tt := range tests {
		if !tt.got.Equal(tt.want) {
			t.Errorf("%s = %s, want %s", tt.name, tt.got.Format("2006-01-02"), tt.want.Format("2006-01-02"))
		}
	}
}
