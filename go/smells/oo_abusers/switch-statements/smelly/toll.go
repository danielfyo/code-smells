// Package smelly illustrates Switch Statements / Repeated Switches: the same
// type switch on the vehicle type is repeated in every function. Adding a
// new vehicle forces you to find and change every switch.
package smelly

import "fmt"

// Car is a passenger car.
type Car struct{ Electric bool }

// Truck is a truck with axles.
type Truck struct{ Axles int }

// Motorcycle is a motorbike.
type Motorcycle struct{}

// TollFee computes the toll.
// SMELL: type switch #1 on the concrete type.
func TollFee(v any) (float64, error) {
	switch x := v.(type) {
	case Car:
		if x.Electric {
			return 2.0, nil
		}
		return 4.0, nil
	case Truck:
		return 3.5 * float64(x.Axles), nil
	case Motorcycle:
		return 1.5, nil
	default:
		return 0, fmt.Errorf("unknown vehicle %T", v)
	}
}

// MaxSpeed returns the motorway speed limit.
// SMELL: type switch #2, same set of cases repeated.
func MaxSpeed(v any) (int, error) {
	switch v.(type) {
	case Car, Motorcycle:
		return 120, nil
	case Truck:
		return 90, nil
	default:
		return 0, fmt.Errorf("unknown vehicle %T", v)
	}
}

// Describe returns a description.
// SMELL: type switch #3. And the default turns design errors into runtime errors.
func Describe(v any) string {
	switch x := v.(type) {
	case Car:
		if x.Electric {
			return "electric car"
		}
		return "car"
	case Truck:
		return fmt.Sprintf("truck with %d axles", x.Axles)
	case Motorcycle:
		return "motorcycle"
	default:
		return "unknown"
	}
}
