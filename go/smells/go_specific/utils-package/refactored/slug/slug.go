// Package slug generates readable identifiers for URLs.
//
// REFACTOR: a small package with one responsibility; the call
// slug.Make(title) reads like a sentence.
package slug

import "strings"

// Make turns a title into a slug ("Green Tea" → "green-tea").
func Make(title string) string {
	return strings.Join(strings.Fields(strings.ToLower(title)), "-")
}
