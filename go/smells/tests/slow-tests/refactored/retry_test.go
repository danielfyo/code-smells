package refactored

import (
	"errors"
	"testing"
	"time"
)

// REFACTOR: a fake Sleep that records the waits is injected. The test is
// instantaneous and also checks something it could not before: the exact
// exponential progression.
func TestRetrierEventuallySucceeds(t *testing.T) {
	var waits []time.Duration
	r := Retrier{Attempts: 4, Base: time.Second, Sleep: func(d time.Duration) { waits = append(waits, d) }}
	calls := 0
	err := r.Do(func() error {
		calls++
		if calls < 4 {
			return errors.New("temporary")
		}
		return nil
	})
	if err != nil || calls != 4 {
		t.Fatalf("err=%v calls=%d", err, calls)
	}
	want := []time.Duration{time.Second, 2 * time.Second, 4 * time.Second}
	if len(waits) != len(want) {
		t.Fatalf("waits = %v, want %v", waits, want)
	}
	for i := range want {
		if waits[i] != want[i] {
			t.Fatalf("waits = %v, want %v", waits, want)
		}
	}
}

func TestRetrierGivesUp(t *testing.T) {
	r := Retrier{Attempts: 2, Base: time.Hour, Sleep: func(time.Duration) {}}
	if err := r.Do(func() error { return errors.New("down") }); !errors.Is(err, ErrGaveUp) {
		t.Fatalf("err = %v", err)
	}
}
