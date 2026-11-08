// Package smelly shows names containing "And" that reveal the function does
// two things at once.
package smelly

import (
	"errors"
	"strings"
)

// User is a registered user.
type User struct {
	Email string
}

// Registry stores users.
type Registry struct {
	Users []User
}

// ValidateAndSave SMELL: the "And" in the name confesses two
// responsibilities. You cannot validate without saving (e.g. in a form) nor
// save something already validated without validating it again.
func (r *Registry) ValidateAndSave(email string) error {
	email = strings.TrimSpace(email)
	if !strings.Contains(email, "@") {
		return errors.New("invalid email")
	}
	r.Users = append(r.Users, User{Email: email})
	return nil
}
