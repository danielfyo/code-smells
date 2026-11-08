// Package smelly illustrates Negative Conditionals: fields and functions
// named in the negative (NotRequired, isNotValid) force you to read double
// negations such as !f.NotRequired or !isNotValid(...).
package smelly

import "strings"

// Field is a form field.
// SMELL: NotRequired and NotEditable invite double negations.
type Field struct {
	Name        string
	Value       string
	NotRequired bool
	NotEditable bool
}

func isNotEmpty(s string) bool { return strings.TrimSpace(s) != "" }

func isNotValid(f Field) bool {
	// SMELL: a double negation that is hard to follow.
	return !f.NotRequired && !isNotEmpty(f.Value)
}

// Errors returns the names of invalid fields and of editable ones.
func Errors(fields []Field) (invalid []string, editable []string) {
	for _, f := range fields {
		if !(!isNotValid(f)) {
			invalid = append(invalid, f.Name)
		}
		if !f.NotEditable {
			editable = append(editable, f.Name)
		}
	}
	return invalid, editable
}
