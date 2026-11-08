package smelly

import (
	"testing"
	"time"
)

// SMELL documented: the test has to replicate the logic with the real time
// and can never force the case it cares about.
func TestPriceDependsOnRealClock(t *testing.T) {
	want := 3.0
	if h := time.Now().Hour(); h >= 18 && h < 20 {
		want = 1.5
	}
	if got, ok := Price("beer"); !ok || got != want {
		t.Errorf("beer = %v, want %v", got, want)
	}
	if _, ok := Price("wine"); ok {
		t.Error("wine should not be found")
	}
}
