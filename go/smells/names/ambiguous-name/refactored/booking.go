// Package refactored uses unambiguous names that say exactly what each
// function does.
package refactored

import "strings"

// Booking is a hotel booking.
type Booking struct {
	Guest     string
	Nights    int
	Cancelled bool
}

// NormalizeGuestName capitalizes the guest name ("aNA" → "Ana").
//
// REFACTOR: Rename Function (Process → NormalizeGuestName).
func NormalizeGuestName(b *Booking) {
	b.Guest = strings.ToUpper(b.Guest[:1]) + strings.ToLower(b.Guest[1:])
}

// Cancel marks the booking as cancelled and returns false if it already was.
//
// REFACTOR: Rename Function (Handle → Cancel).
func Cancel(b *Booking) bool {
	if b.Cancelled {
		return false
	}
	b.Cancelled = true
	return true
}
