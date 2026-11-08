// Package refactored treats invalid input as what it is: an expected error
// returned as a value.
package refactored

import (
	"errors"
	"fmt"
	"strconv"
)

// ErrAgeOutOfRange means an age outside 0..150.
var ErrAgeOutOfRange = errors.New("age out of range")

// ParseAge turns text into an age.
//
// REFACTOR: Replace Exception (panic) with Error Return. panic is reserved
// for broken invariants (bugs), not for validating input.
func ParseAge(s string) (int, error) {
	age, err := strconv.Atoi(s)
	if err != nil {
		return 0, fmt.Errorf("parse age %q: %w", s, err)
	}
	if age < 0 || age > 150 {
		return 0, fmt.Errorf("parse age %q: %w", s, ErrAgeOutOfRange)
	}
	return age, nil
}
