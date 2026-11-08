// Package smelly illustrates Large Class / God Class: a single struct,
// UserManager, stores users, validates passwords, sends emails and builds
// reports. It knows and does everything, so every change touches it.
package smelly

import (
	"errors"
	"fmt"
	"sort"
	"strings"
	"unicode"
)

// SMELL: Large Class. Fields from four different responsibilities
// (persistence, security, notifications and reporting) in the same struct.
type UserManager struct {
	users       map[string]string // email -> password
	sentEmails  []string
	minPassword int
	smtpHost    string
	reportTitle string
}

// NewUserManager creates the manager with its mixed configuration.
func NewUserManager() *UserManager {
	return &UserManager{
		users:       map[string]string{},
		minPassword: 8,
		smtpHost:    "smtp.internal",
		reportTitle: "Users",
	}
}

// Register signs up a user.
// SMELL: the method mixes validation, storage and notification.
func (m *UserManager) Register(email, password string) error {
	if !strings.Contains(email, "@") {
		return errors.New("invalid email")
	}
	if _, ok := m.users[email]; ok {
		return errors.New("email already registered")
	}
	if !m.isStrong(password) {
		return errors.New("weak password")
	}
	m.users[email] = password
	m.sendEmail(email, "Welcome!")
	return nil
}

func (m *UserManager) isStrong(p string) bool {
	if len(p) < m.minPassword {
		return false
	}
	hasDigit := false
	for _, r := range p {
		if unicode.IsDigit(r) {
			hasDigit = true
		}
	}
	return hasDigit
}

// SMELL: SMTP details inside the user manager.
func (m *UserManager) sendEmail(to, body string) {
	m.sentEmails = append(m.sentEmails, fmt.Sprintf("[%s] %s: %s", m.smtpHost, to, body))
}

// SentEmails returns the sent emails.
func (m *UserManager) SentEmails() []string { return m.sentEmails }

// Report builds a sorted listing.
// SMELL: report formatting lives here too.
func (m *UserManager) Report() string {
	emails := make([]string, 0, len(m.users))
	for e := range m.users {
		emails = append(emails, e)
	}
	sort.Strings(emails)
	return m.reportTitle + ": " + strings.Join(emails, ", ")
}
