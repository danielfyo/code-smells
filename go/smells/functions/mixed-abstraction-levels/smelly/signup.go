// Package smelly illustrates Mixed Levels of Abstraction: Signup alternates
// high-level steps (validate, save, welcome) with low-level details
// (iterating runes, hashing bytes, building strings).
package smelly

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"
	"unicode"
)

// Store stores users (email -> hash).
type Store map[string]string

// Signup registers a user and returns the welcome message.
// SMELL: Mixed Levels of Abstraction.
func Signup(s Store, email, password string) (string, error) {
	// low level: character-by-character normalization
	var b strings.Builder
	for _, r := range strings.TrimSpace(email) {
		b.WriteRune(unicode.ToLower(r))
	}
	email = b.String()
	// high level: business rule
	if !strings.Contains(email, "@") || len(password) < 8 {
		return "", errors.New("invalid signup data")
	}
	if _, exists := s[email]; exists {
		return "", errors.New("already registered")
	}
	// low level: cryptography and encoding
	sum := sha256.Sum256([]byte(email + ":" + password))
	s[email] = hex.EncodeToString(sum[:])
	// mid level: message building
	name := email[:strings.Index(email, "@")]
	return "Welcome, " + strings.ToUpper(name[:1]) + name[1:] + "!", nil
}
