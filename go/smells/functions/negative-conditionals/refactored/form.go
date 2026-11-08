// Package refactored fixes Negative Conditionals by expressing fields and
// predicates in positive form, so every condition reads at a glance.
package refactored

import "strings"

// Field is a form field.
// REFACTOR: Rename Field to a positive form (Required, Editable).
type Field struct {
	Name     string
	Value    string
	Required bool
	Editable bool
}

// REFACTOR: Rename Function to a positive form.
func isBlank(s string) bool { return strings.TrimSpace(s) == "" }

func (f Field) isMissing() bool { return f.Required && isBlank(f.Value) }

// Errors returns the names of invalid fields and of editable ones.
func Errors(fields []Field) (invalid []string, editable []string) {
	for _, f := range fields {
		if f.isMissing() {
			invalid = append(invalid, f.Name)
		}
		if f.Editable {
			editable = append(editable, f.Name)
		}
	}
	return invalid, editable
}
