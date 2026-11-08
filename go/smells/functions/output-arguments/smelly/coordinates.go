// Package smelly illustrates Output Arguments: the function returns its
// results by writing into pointers received as parameters (including an
// error message) instead of using multiple return values.
package smelly

import (
	"strconv"
	"strings"
)

// ParseCoordinates parses "lat,lon".
// SMELL: Output Arguments. lat, lon and errMsg are outputs disguised as
// inputs; the caller must prepare variables and read an opaque bool.
func ParseCoordinates(s string, lat, lon *float64, errMsg *string) bool {
	parts := strings.Split(s, ",")
	if len(parts) != 2 {
		*errMsg = "expected lat,lon"
		return false
	}
	la, err1 := strconv.ParseFloat(strings.TrimSpace(parts[0]), 64)
	lo, err2 := strconv.ParseFloat(strings.TrimSpace(parts[1]), 64)
	if err1 != nil || err2 != nil {
		*errMsg = "not a number"
		return false
	}
	if la < -90 || la > 90 || lo < -180 || lo > 180 {
		*errMsg = "out of range"
		return false
	}
	*lat, *lon = la, lo
	return true
}
