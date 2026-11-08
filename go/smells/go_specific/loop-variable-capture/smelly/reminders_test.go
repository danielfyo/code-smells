package smelly

import (
	"slices"
	"testing"
)

func TestBuildSenders(t *testing.T) {
	var got []string
	for _, send := range BuildSenders([]string{"ana", "luis", "eva"}) {
		got = append(got, send().Customer)
	}
	if !slices.Equal(got, []string{"ana", "luis", "eva"}) {
		t.Fatalf("got %v", got)
	}
}

// Documents the classic bug (the behavior of every loop before 1.22): all
// closures see the last value.
func TestBuildSendersSharedCapturesLastValue(t *testing.T) {
	for _, send := range BuildSendersShared([]string{"ana", "luis", "eva"}) {
		if c := send().Customer; c != "eva" {
			t.Fatalf("got %q, want the last value \"eva\"", c)
		}
	}
}

func TestSendAll(t *testing.T) {
	got := SendAll([]string{"ana", "luis", "eva"})
	slices.Sort(got)
	if !slices.Equal(got, []string{"ana", "eva", "luis"}) {
		t.Fatalf("got %v", got)
	}
}
