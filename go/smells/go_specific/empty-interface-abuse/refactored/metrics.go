// Package refactored replaces any with constrained generics and with structs
// with typed fields.
package refactored

// Number restricts the accepted numeric types.
type Number interface {
	~int | ~int64 | ~float64
}

// Sum adds numeric values of the same type.
//
// REFACTOR: Replace any with Type Parameter. Sum([]string{...}) no longer compiles.
func Sum[T Number](values []T) T {
	var total T
	for _, v := range values {
		total += v
	}
	return total
}

// Settings groups the settings with concrete types.
//
// REFACTOR: Replace map[string]any with struct; no type assertions.
type Settings struct {
	MaxItems int
}
