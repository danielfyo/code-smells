// Package utils SMELL: a junk drawer. Money formatting, slug generation,
// email validation and retries live together with no relation to each other.
// The name says nothing and the whole project ends up importing it (and it grows).
package utils

import (
	"fmt"
	"strings"
)

// FormatMoney formats cents as euros.
func FormatMoney(cents int64) string { return fmt.Sprintf("%d.%02d EUR", cents/100, cents%100) }

// Slugify turns a title into a slug for URLs.
func Slugify(s string) string {
	return strings.Join(strings.Fields(strings.ToLower(s)), "-")
}

// IsEmail does a basic email validation.
func IsEmail(s string) bool { return strings.Contains(s, "@") }

// Retry runs f up to n times.
func Retry(n int, f func() error) (err error) {
	for range n {
		if err = f(); err == nil {
			return nil
		}
	}
	return err
}
