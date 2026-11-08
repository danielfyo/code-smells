// Package smelly illustrates Incomplete Library Class: the standard library
// time package cannot add business days, so every client reimplements
// skipping weekends in its own way.
package smelly

import "time"

// InvoiceDueDate is due 10 business days after issue.
// SMELL: Incomplete Library Class. A time extension written inline.
func InvoiceDueDate(issued time.Time) time.Time {
	d := issued
	added := 0
	for added < 10 {
		d = d.AddDate(0, 0, 1)
		if d.Weekday() != time.Saturday && d.Weekday() != time.Sunday {
			added++
		}
	}
	return d
}

// DeliveryEstimate arrives in 3 business days.
// SMELL: a second copy, with a different way of checking for weekends.
func DeliveryEstimate(shipped time.Time) time.Time {
	d := shipped
	for n := 3; n > 0; {
		d = d.Add(24 * time.Hour)
		wd := d.Weekday()
		if wd == time.Saturday || wd == time.Sunday {
			continue
		}
		n--
	}
	return d
}
