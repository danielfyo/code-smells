// Package refactored fixes Artificial Coupling by moving the generic
// constants out of the concrete type: they live at package level (or the
// standard library ones are used) and SessionStore no longer knows PDFRenderer.
package refactored

import "time"

// Day is a universal duration. REFACTOR: Move Field to a neutral scope.
const Day = 24 * time.Hour

// DefaultRetries is a shared policy that belongs to no type in particular.
const DefaultRetries = 3

// PDFRenderer generates PDF documents; it no longer exports unrelated constants.
type PDFRenderer struct{}

// Render simulates rendering.
func (PDFRenderer) Render(title string) string { return "%PDF " + title }

// SessionStore expires sessions without depending on PDFRenderer.
type SessionStore struct{ TTLDays int }

// ExpiresAt computes the expiry time.
func (s SessionStore) ExpiresAt(created time.Time) time.Time {
	return created.Add(time.Duration(s.TTLDays) * Day)
}

// Retries returns the persistence retries.
func (SessionStore) Retries() int { return DefaultRetries }
