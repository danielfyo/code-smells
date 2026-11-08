// Package refactored splits the two responsibilities into functions with a
// single verb each; Register composes them.
package refactored

import (
	"errors"
	"strings"
)

// ErrInvalidEmail means the email does not have an acceptable format.
var ErrInvalidEmail = errors.New("invalid email")

// User is a registered user.
type User struct {
	Email string
}

// Registry stores users.
type Registry struct {
	Users []User
}

// REFACTOR: Split Function. ValidateEmail and Save can be used separately.

// ValidateEmail normalizes and validates an email.
func ValidateEmail(email string) (string, error) {
	email = strings.TrimSpace(email)
	if !strings.Contains(email, "@") {
		return "", ErrInvalidEmail
	}
	return email, nil
}

// Save stores an already validated user.
func (r *Registry) Save(u User) {
	r.Users = append(r.Users, u)
}

// Register is the full use case: validate and, if all is well, save.
func (r *Registry) Register(email string) error {
	valid, err := ValidateEmail(email)
	if err != nil {
		return err
	}
	r.Save(User{Email: valid})
	return nil
}
