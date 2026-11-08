// Package smelly uses a long, cryptic regular expression, with no name and no
// decomposition, to validate order references.
package smelly

import "regexp"

// IsValidOrderRef validates references such as "ES-2024-000123-A".
//
// SMELL: monolithic regex. What does each group mean? Why (19|20)?
// Changing one part without breaking another requires deciphering all of it.
func IsValidOrderRef(ref string) bool {
	return regexp.MustCompile(`^(?:[A-Z]{2})-(?:19|20)\d{2}-(?:\d{6})-(?:[A-Z]|X\d)$`).MatchString(ref)
}
