// Package refactored always returns the error interface type and a literal
// nil when there is no failure.
package refactored

import "strings"

// ValidationError groups the problems of a form.
type ValidationError struct {
	Fields []string
}

func (e *ValidationError) Error() string { return "invalid fields: " + strings.Join(e.Fields, ", ") }

// Signup is a sign-up form.
type Signup struct {
	Email, Password string
}

// Validate returns an error (not a concrete pointer).
//
// REFACTOR: the return type is the error interface and the happy path
// returns the literal nil. Callers use errors.As to get the fields.
func Validate(s Signup) error {
	var fields []string
	if !strings.Contains(s.Email, "@") {
		fields = append(fields, "email")
	}
	if len(s.Password) < 8 {
		fields = append(fields, "password")
	}
	if len(fields) == 0 {
		return nil
	}
	return &ValidationError{Fields: fields}
}

// Register signs the user up if the form is valid.
func Register(s Signup) error { return Validate(s) }
