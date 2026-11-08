// Package refactored fixes Output Arguments by returning a value and an
// error: the idiomatic Go way of producing several results.
package refactored

import (
	"errors"
	"strconv"
	"strings"
)

// Coordinate is a geographic point.
type Coordinate struct{ Lat, Lon float64 }

// Possible parsing errors.
var (
	ErrFormat     = errors.New("expected lat,lon")
	ErrNotANumber = errors.New("not a number")
	ErrOutOfRange = errors.New("out of range")
)

// ParseCoordinates parses "lat,lon".
// REFACTOR: Replace Output Arguments with Return Values (value + error).
func ParseCoordinates(s string) (Coordinate, error) {
	rawLat, rawLon, ok := strings.Cut(s, ",")
	if !ok || strings.Contains(rawLon, ",") {
		return Coordinate{}, ErrFormat
	}
	lat, err1 := strconv.ParseFloat(strings.TrimSpace(rawLat), 64)
	lon, err2 := strconv.ParseFloat(strings.TrimSpace(rawLon), 64)
	if err1 != nil || err2 != nil {
		return Coordinate{}, ErrNotANumber
	}
	if lat < -90 || lat > 90 || lon < -180 || lon > 180 {
		return Coordinate{}, ErrOutOfRange
	}
	return Coordinate{lat, lon}, nil
}
