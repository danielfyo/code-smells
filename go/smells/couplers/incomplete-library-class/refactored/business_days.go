// Package refactored fixes Incomplete Library Class by creating a local
// extension of the library: a single place that adds what time does not
// offer (business days) and that every client reuses.
package refactored

import "time"

// IsWeekend reports whether the date falls on Saturday or Sunday.
func IsWeekend(t time.Time) bool {
	wd := t.Weekday()
	return wd == time.Saturday || wd == time.Sunday
}

// AddBusinessDays adds n business days.
// REFACTOR: Introduce Foreign Method / Introduce Local Extension.
func AddBusinessDays(t time.Time, n int) time.Time {
	for n > 0 {
		t = t.AddDate(0, 0, 1)
		if !IsWeekend(t) {
			n--
		}
	}
	return t
}

// InvoiceDueDate is due 10 business days after issue.
func InvoiceDueDate(issued time.Time) time.Time { return AddBusinessDays(issued, 10) }

// DeliveryEstimate arrives in 3 business days.
func DeliveryEstimate(shipped time.Time) time.Time { return AddBusinessDays(shipped, 3) }
