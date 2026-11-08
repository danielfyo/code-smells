// Package smelly holds the production code (retries with exponential backoff);
// the smell lives in the test file.
package smelly

import (
	"errors"
	"time"
)

// ErrGaveUp means the retries were exhausted.
var ErrGaveUp = errors.New("gave up after retries")

// Retrier retries an operation with exponential backoff.
// Sleep is injectable so tests do not have to really wait.
type Retrier struct {
	Attempts int
	Base     time.Duration
	Sleep    func(time.Duration)
}

// Do runs op until it succeeds or the attempts run out.
func (r Retrier) Do(op func() error) error {
	sleep := r.Sleep
	if sleep == nil {
		sleep = time.Sleep
	}
	wait := r.Base
	for i := 0; i < r.Attempts; i++ {
		if err := op(); err == nil {
			return nil
		}
		if i < r.Attempts-1 {
			sleep(wait)
			wait *= 2
		}
	}
	return ErrGaveUp
}
