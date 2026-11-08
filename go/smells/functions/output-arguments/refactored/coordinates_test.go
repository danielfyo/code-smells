package refactored

import (
	"errors"
	"testing"
)

func TestParseCoordinates(t *testing.T) {
	tests := []struct {
		in      string
		want    Coordinate
		wantErr error
	}{
		{"40.4168, -3.7038", Coordinate{40.4168, -3.7038}, nil},
		{"40.4", Coordinate{}, ErrFormat},
		{"1,2,3", Coordinate{}, ErrFormat},
		{"a,b", Coordinate{}, ErrNotANumber},
		{"91,0", Coordinate{}, ErrOutOfRange},
	}
	for _, tt := range tests {
		got, err := ParseCoordinates(tt.in)
		if got != tt.want || !errors.Is(err, tt.wantErr) {
			t.Errorf("%q = %v, %v", tt.in, got, err)
		}
	}
}
