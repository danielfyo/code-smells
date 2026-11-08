// Package refactored fixes Inappropriate Intimacy: Student owns its rules
// and state and offers an explicit operation (AddCourse); Course only uses
// that public interface.
package refactored

import (
	"errors"
	"slices"
)

// MaxCredits is the credit limit per student.
const MaxCredits = 30

// Domain errors.
var (
	ErrAlreadyEnrolled = errors.New("already enrolled")
	ErrCreditLimit     = errors.New("credit limit exceeded")
)

// Student is a student that protects its invariants.
type Student struct {
	Name    string
	credits int
	courses []string
}

// NewStudent creates a student.
func NewStudent(name string) *Student { return &Student{Name: name} }

// Credits returns the enrolled credits.
func (s *Student) Credits() int { return s.credits }

// AddCourse registers a course validating the student's own rules.
// REFACTOR: Move Function + Encapsulate Collection.
func (s *Student) AddCourse(code string, credits int) error {
	if slices.Contains(s.courses, code) {
		return ErrAlreadyEnrolled
	}
	if s.credits+credits > MaxCredits {
		return ErrCreditLimit
	}
	s.credits += credits
	s.courses = append(s.courses, code)
	return nil
}

// Course is a course.
type Course struct {
	Code     string
	Credits  int
	enrolled []*Student
}

// Enroll enrolls a student through its public API.
// REFACTOR: Hide Delegate / Tell, Don't Ask.
func (c *Course) Enroll(s *Student) error {
	if err := s.AddCourse(c.Code, c.Credits); err != nil {
		return err
	}
	c.enrolled = append(c.enrolled, s)
	return nil
}

// Size returns the number of enrolled students.
func (c *Course) Size() int { return len(c.enrolled) }
