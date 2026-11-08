package smelly

import (
	"slices"
	"testing"
)

func TestErrors(t *testing.T) {
	fields := []Field{
		{Name: "email", Value: " "},
		{Name: "nickname", NotRequired: true},
		{Name: "id", Value: "42", NotEditable: true},
	}
	invalid, editable := Errors(fields)
	if !slices.Equal(invalid, []string{"email"}) || !slices.Equal(editable, []string{"email", "nickname"}) {
		t.Errorf("got %v %v", invalid, editable)
	}
}
