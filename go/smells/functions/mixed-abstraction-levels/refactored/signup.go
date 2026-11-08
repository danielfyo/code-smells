// Package refactored fixes Mixed Levels of Abstraction: Signup only
// orchestrates steps at the same level and every technical detail lives in
// its own function (Single Level of Abstraction Principle).
package refactored

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"
)

// Store stores users (email -> hash).
type Store map[string]string

// Signup registers a user and returns the welcome message.
// REFACTOR: Compose Method (all steps at the same level).
func Signup(s Store, email, password string) (string, error) {
	email = normalizeEmail(email)
	if err := validate(email, password); err != nil {
		return "", err
	}
	if _, exists := s[email]; exists {
		return "", errors.New("already registered")
	}
	s[email] = hashPassword(email, password)
	return welcomeMessage(email), nil
}

// REFACTOR: Extract Function for each low-level detail.
func normalizeEmail(email string) string { return strings.ToLower(strings.TrimSpace(email)) }

func validate(email, password string) error {
	if !strings.Contains(email, "@") || len(password) < 8 {
		return errors.New("invalid signup data")
	}
	return nil
}

func hashPassword(email, password string) string {
	sum := sha256.Sum256([]byte(email + ":" + password))
	return hex.EncodeToString(sum[:])
}

func welcomeMessage(email string) string {
	name, _, _ := strings.Cut(email, "@")
	return "Welcome, " + strings.ToUpper(name[:1]) + name[1:] + "!"
}
