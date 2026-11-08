// Package refactored implements the behavior the name promises: it ignores
// case and accepts the three-letter abbreviation.
package refactored

import (
	"fmt"
	"strings"
	"time"
)

// ParseWeekday turns "Monday", "monday", "Mon" or "MON" into time.Weekday.
//
// REFACTOR: principle of least surprise; the function does what its name and
// type suggest, and the error says which input failed.
func ParseWeekday(name string) (time.Weekday, error) {
	in := strings.ToLower(strings.TrimSpace(name))
	for d := time.Sunday; d <= time.Saturday; d++ {
		full := strings.ToLower(d.String())
		if in == full || in == full[:3] {
			return d, nil
		}
	}
	return 0, fmt.Errorf("parse weekday %q: unknown day", name)
}
