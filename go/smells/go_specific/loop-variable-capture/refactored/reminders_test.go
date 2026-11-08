package refactored

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

func TestSendAll(t *testing.T) {
	got := SendAll([]string{"ana", "luis", "eva"})
	slices.Sort(got)
	if !slices.Equal(got, []string{"ana", "eva", "luis"}) {
		t.Fatalf("got %v", got)
	}
}
