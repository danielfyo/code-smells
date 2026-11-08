package refactored

import (
	"slices"
	"testing"
)

func TestErrors(t *testing.T) {
	fields := []Field{
		{Name: "email", Value: " ", Required: true, Editable: true},
		{Name: "nickname", Editable: true},
		{Name: "id", Value: "42", Required: true},
	}
	invalid, editable := Errors(fields)
	if !slices.Equal(invalid, []string{"email"}) || !slices.Equal(editable, []string{"email", "nickname"}) {
		t.Errorf("got %v %v", invalid, editable)
	}
}
