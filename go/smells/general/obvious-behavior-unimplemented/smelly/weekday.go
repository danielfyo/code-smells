// Package smelly shows a function that does not do what anyone would expect
// from its name: ParseWeekday accepts neither abbreviations nor other casing.
package smelly

import (
	"errors"
	"time"
)

// ParseWeekday turns a day name into time.Weekday.
//
// SMELL: it only accepts exactly "Monday", "Tuesday"... Any reader would
// expect "monday", "MON" or "Mon" to work; since they do not, every caller
// ends up writing its own normalization (or a bug).
func ParseWeekday(name string) (time.Weekday, error) {
	for d := time.Sunday; d <= time.Saturday; d++ {
		if d.String() == name {
			return d, nil
		}
	}
	return 0, errors.New("unknown weekday")
}
