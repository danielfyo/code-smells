package smelly

import "testing"

func TestParseCoordinates(t *testing.T) {
	tests := []struct {
		in       string
		lat, lon float64
		msg      string
	}{
		{"40.4168, -3.7038", 40.4168, -3.7038, ""},
		{"40.4", 0, 0, "expected lat,lon"},
		{"a,b", 0, 0, "not a number"},
		{"91,0", 0, 0, "out of range"},
	}
	for _, tt := range tests {
		var lat, lon float64
		var msg string
		ok := ParseCoordinates(tt.in, &lat, &lon, &msg)
		if ok != (tt.msg == "") || lat != tt.lat || lon != tt.lon || msg != tt.msg {
			t.Errorf("%q = %v %v %v %q", tt.in, ok, lat, lon, msg)
		}
	}
}
