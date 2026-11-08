// Package smelly shows ambiguous names (Process, Handle, DoRename) that admit
// several interpretations.
package smelly

import "strings"

// Booking is a hotel booking.
type Booking struct {
	Guest     string
	Nights    int
	Cancelled bool
}

// Process SMELL: process what? Validate, charge, cancel? You must read the
// body to learn that it normalizes the guest name.
func Process(b *Booking) {
	b.Guest = strings.ToUpper(b.Guest[:1]) + strings.ToLower(b.Guest[1:])
}

// Handle SMELL: "handle" can mean anything; it actually cancels.
func Handle(b *Booking) bool {
	if b.Cancelled {
		return false
	}
	b.Cancelled = true
	return true
}
