// Package refactored fixes Repeated Switches with interface polymorphism:
// each vehicle implements its own rules and adding a new one means creating
// a type, without touching existing code (open/closed).
package refactored

import "fmt"

// Vehicle is the small interface that replaces the switches.
// REFACTOR: Replace Conditional with Polymorphism.
type Vehicle interface {
	TollFee() float64
	MaxSpeed() int
	Describe() string
}

// Car is a passenger car.
type Car struct{ Electric bool }

// TollFee for the car.
func (c Car) TollFee() float64 {
	if c.Electric {
		return 2.0
	}
	return 4.0
}

// MaxSpeed for the car.
func (Car) MaxSpeed() int { return 120 }

// Describe the car.
func (c Car) Describe() string {
	if c.Electric {
		return "electric car"
	}
	return "car"
}

// Truck is a truck with axles.
type Truck struct{ Axles int }

// TollFee for the truck.
func (t Truck) TollFee() float64 { return 3.5 * float64(t.Axles) }

// MaxSpeed for the truck.
func (Truck) MaxSpeed() int { return 90 }

// Describe the truck.
func (t Truck) Describe() string { return fmt.Sprintf("truck with %d axles", t.Axles) }

// Motorcycle is a motorbike.
type Motorcycle struct{}

// TollFee for the motorcycle.
func (Motorcycle) TollFee() float64 { return 1.5 }

// MaxSpeed for the motorcycle.
func (Motorcycle) MaxSpeed() int { return 120 }

// Describe the motorcycle.
func (Motorcycle) Describe() string { return "motorcycle" }

// REFACTOR: compile-time check; an incomplete type does not compile
// (as opposed to the runtime default branch of the smelly version).
var _ = []Vehicle{Car{}, Truck{}, Motorcycle{}}
