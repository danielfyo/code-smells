// Package smelly illustrates Inappropriate Intimacy: Course and Student live
// in the same package and Course takes advantage of that to read and modify
// Student's unexported fields (credits and course list) directly. Student
// cannot protect its own rules.
package smelly

import "errors"

// Student is a student.
type Student struct {
	Name    string
	credits int
	courses []string
}

// NewStudent creates a student.
func NewStudent(name string) *Student { return &Student{Name: name} }

// Credits returns the enrolled credits.
func (s *Student) Credits() int { return s.credits }

// Course is a course.
type Course struct {
	Code     string
	Credits  int
	enrolled []*Student
}

// Enroll enrolls a student.
// SMELL: Inappropriate Intimacy. Course knows and manipulates the internal
// state of Student (including the 30-credit maximum rule).
func (c *Course) Enroll(s *Student) error {
	for _, code := range s.courses {
		if code == c.Code {
			return errors.New("already enrolled")
		}
	}
	if s.credits+c.Credits > 30 {
		return errors.New("credit limit exceeded")
	}
	s.credits += c.Credits
	s.courses = append(s.courses, c.Code)
	c.enrolled = append(c.enrolled, s)
	return nil
}

// Size returns the number of enrolled students.
func (c *Course) Size() int { return len(c.enrolled) }
