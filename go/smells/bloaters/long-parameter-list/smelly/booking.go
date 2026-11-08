// Package smelly illustrates Long Parameter List: creating a hotel booking
// requires nine positional parameters, several of the same type, that are
// easy to mix up at the call site.
package smelly

import (
	"fmt"
	"time"
)

// Booking is a hotel reservation.
type Booking struct {
	Guest     string
	Email     string
	Room      string
	CheckIn   time.Time
	CheckOut  time.Time
	Adults    int
	Children  int
	Breakfast bool
	Parking   bool
}

// SMELL: Long Parameter List. Nine arguments; adults/children and
// breakfast/parking can be swapped without the compiler noticing.
func NewBooking(guest, email, room string, checkIn, checkOut time.Time,
	adults, children int, breakfast, parking bool) (Booking, error) {
	if !checkOut.After(checkIn) {
		return Booking{}, fmt.Errorf("check-out must be after check-in")
	}
	if adults < 1 {
		return Booking{}, fmt.Errorf("at least one adult is required")
	}
	return Booking{guest, email, room, checkIn, checkOut, adults, children, breakfast, parking}, nil
}

// Nights returns the number of nights.
func (b Booking) Nights() int { return int(b.CheckOut.Sub(b.CheckIn).Hours() / 24) }
