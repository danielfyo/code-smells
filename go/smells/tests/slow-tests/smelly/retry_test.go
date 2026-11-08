package smelly

import (
	"errors"
	"testing"
	"time"
)

// SMELL: the test uses the real clock. With these values it takes ~210 ms
// (in the real system, with Base = 1s, it would be minutes). Multiplied by
// hundreds of tests, nobody runs the suite before committing.
func TestRetrierEventuallySucceeds(t *testing.T) {
	calls := 0
	r := Retrier{Attempts: 4, Base: 30 * time.Millisecond}
	start := time.Now()
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
	if time.Since(start) < 200*time.Millisecond {
		t.Fatal("expected real waiting")
	}
}
