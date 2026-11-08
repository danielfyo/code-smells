// Package refactored builds the regular expression from named pieces and
// compiles it only once.
package refactored

import (
	"regexp"
	"strings"
)

// REFACTOR: Extract Variable on the regex; each fragment has a name that
// documents its intent, and the pattern is compiled once at load time.
const (
	countryCode = `[A-Z]{2}`       // ISO country code
	year        = `(?:19|20)\d{2}` // year between 1900 and 2099
	sequence    = `\d{6}`          // zero-padded order number
	checkSuffix = `(?:[A-Z]|X\d)`  // check letter, or X + digit for manual orders
)

var orderRefPattern = regexp.MustCompile(
	"^" + strings.Join([]string{countryCode, year, sequence, checkSuffix}, "-") + "$",
)

// IsValidOrderRef validates references such as "ES-2024-000123-A".
func IsValidOrderRef(ref string) bool { return orderRefPattern.MatchString(ref) }
