// Package smelly returns a typed nil pointer as an error: the resulting
// interface is NOT nil and the caller thinks something failed.
package smelly

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

// Validate SMELL: the return type is *ValidationError. When there are no
// problems it returns (*ValidationError)(nil)...
func Validate(s Signup) *ValidationError {
	var fields []string
	if !strings.Contains(s.Email, "@") {
		fields = append(fields, "email")
	}
	if len(s.Password) < 8 {
		fields = append(fields, "password")
	}
	if len(fields) == 0 {
		return nil // nil, but of type *ValidationError
	}
	return &ValidationError{Fields: fields}
}

// Register SMELL: ...and when returned as error, the interface holds
// (type=*ValidationError, value=nil), which is not nil. err != nil is true
// even for a valid form.
func Register(s Signup) error {
	return Validate(s)
}
