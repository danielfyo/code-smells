// Package refactored fixes Long Parameter List by grouping the data into
// named parameter objects (guest, stay, occupancy, extras).
package refactored

import (
	"fmt"
	"time"
)

// Guest identifies the customer. REFACTOR: Introduce Parameter Object.
type Guest struct{ Name, Email string }

// Stay groups the dates. REFACTOR: Introduce Parameter Object.
type Stay struct{ CheckIn, CheckOut time.Time }

// Nights returns the number of nights.
func (s Stay) Nights() int { return int(s.CheckOut.Sub(s.CheckIn).Hours() / 24) }

// Occupancy groups adults and children.
type Occupancy struct{ Adults, Children int }

// Extras groups optional services as named fields (not positional bools).
type Extras struct{ Breakfast, Parking bool }

// BookingRequest is the request object.
// REFACTOR: Introduce Parameter Object. Calls use named literals.
type BookingRequest struct {
	Guest     Guest
	Room      string
	Stay      Stay
	Occupancy Occupancy
	Extras    Extras
}

// Booking is a validated reservation.
type Booking struct{ BookingRequest }

// NewBooking validates the request and creates the booking.
func NewBooking(req BookingRequest) (Booking, error) {
	if !req.Stay.CheckOut.After(req.Stay.CheckIn) {
		return Booking{}, fmt.Errorf("check-out must be after check-in")
	}
	if req.Occupancy.Adults < 1 {
		return Booking{}, fmt.Errorf("at least one adult is required")
	}
	return Booking{req}, nil
}

// Nights delegates to the stay.
func (b Booking) Nights() int { return b.Stay.Nights() }
