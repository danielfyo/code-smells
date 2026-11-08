// Package smelly holds the production code (book lending); the smell lives in
// the test file.
package smelly

import "errors"

// ErrAlreadyLent means the book is already lent.
var ErrAlreadyLent = errors.New("book already lent")

// Library manages loans.
type Library struct {
	lent map[string]string // libro → socio
}

// NewLibrary creates a library with no loans.
func NewLibrary() *Library { return &Library{lent: map[string]string{}} }

// Lend lends a book to a member.
func (l *Library) Lend(book, member string) error {
	if _, ok := l.lent[book]; ok {
		return ErrAlreadyLent
	}
	l.lent[book] = member
	return nil
}

// Return returns a book.
func (l *Library) Return(book string) { delete(l.lent, book) }

// LentCount returns how many books are lent.
func (l *Library) LentCount() int { return len(l.lent) }
