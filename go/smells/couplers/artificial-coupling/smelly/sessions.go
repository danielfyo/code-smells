// Package smelly illustrates Artificial Coupling: generic constants (seconds
// per day, default retries) were declared as methods of a concrete type,
// PDFRenderer. Now SessionStore, which has nothing to do with PDFs, depends
// on PDFRenderer just to get those numbers.
package smelly

import "time"

// PDFRenderer generates PDF documents.
type PDFRenderer struct{}

// Render simulates rendering.
func (PDFRenderer) Render(title string) string { return "%PDF " + title }

// SecondsPerDay is a universal constant tied to a concrete type.
// SMELL: Artificial Coupling.
func (PDFRenderer) SecondsPerDay() int { return 86400 }

// DefaultRetries has nothing to do with PDFs either.
func (PDFRenderer) DefaultRetries() int { return 3 }

// SessionStore expires sessions.
type SessionStore struct{ TTLDays int }

// ExpiresAt computes the expiry time.
// SMELL: to know how many seconds a day has you must create a PDFRenderer.
func (s SessionStore) ExpiresAt(created time.Time) time.Time {
	secs := s.TTLDays * PDFRenderer{}.SecondsPerDay()
	return created.Add(time.Duration(secs) * time.Second)
}

// Retries returns the persistence retries.
func (SessionStore) Retries() int { return PDFRenderer{}.DefaultRetries() }
